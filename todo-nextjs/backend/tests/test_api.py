def test_root(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"message": "Todo API"}


def test_list_empty(client):
    res = client.get("/todos")
    assert res.status_code == 200
    assert res.json() == []


def test_create_todo(client):
    res = client.post("/todos", json={"content": "테스트 항목"})
    assert res.status_code == 201
    body = res.json()
    assert body["id"] >= 1
    assert body["content"] == "테스트 항목"
    assert body["done"] is False
    assert "created_at" in body


def test_create_validates_empty(client):
    res = client.post("/todos", json={"content": ""})
    assert res.status_code == 422


def test_create_validates_too_long(client):
    res = client.post("/todos", json={"content": "a" * 1001})
    assert res.status_code == 422


def test_list_after_create(client):
    client.post("/todos", json={"content": "첫번째"})
    client.post("/todos", json={"content": "두번째"})
    res = client.get("/todos")
    assert res.status_code == 200
    body = res.json()
    assert len(body) == 2


def test_list_orders_by_created_desc(client):
    client.post("/todos", json={"content": "old"})
    client.post("/todos", json={"content": "new"})
    res = client.get("/todos")
    body = res.json()
    assert body[0]["content"] == "new"
    assert body[1]["content"] == "old"


def test_filter_active(client):
    client.post("/todos", json={"content": "a"})
    r = client.post("/todos", json={"content": "b"})
    todo_id = r.json()["id"]
    client.put(f"/todos/{todo_id}", json={"done": True})

    res = client.get("/todos", params={"filter": "active"})
    body = res.json()
    assert len(body) == 1
    assert body[0]["content"] == "a"
    assert body[0]["done"] is False


def test_filter_completed(client):
    client.post("/todos", json={"content": "a"})
    r = client.post("/todos", json={"content": "b"})
    todo_id = r.json()["id"]
    client.put(f"/todos/{todo_id}", json={"done": True})

    res = client.get("/todos", params={"filter": "completed"})
    body = res.json()
    assert len(body) == 1
    assert body[0]["content"] == "b"
    assert body[0]["done"] is True


def test_search(client):
    client.post("/todos", json={"content": "공부하기"})
    client.post("/todos", json={"content": "운동하기"})
    client.post("/todos", json={"content": "공부 복습"})

    res = client.get("/todos", params={"search": "공부"})
    body = res.json()
    assert len(body) == 2


def test_filter_and_search_combined(client):
    r1 = client.post("/todos", json={"content": "공부하기"})
    client.post("/todos", json={"content": "운동하기"})
    client.put(f"/todos/{r1.json()['id']}", json={"done": True})

    res = client.get("/todos", params={"filter": "completed", "search": "공부"})
    body = res.json()
    assert len(body) == 1
    assert body[0]["content"] == "공부하기"


def test_get_one(client):
    r = client.post("/todos", json={"content": "단건"})
    todo_id = r.json()["id"]
    res = client.get(f"/todos/{todo_id}")
    assert res.status_code == 200
    assert res.json()["content"] == "단건"


def test_get_one_not_found(client):
    res = client.get("/todos/9999")
    assert res.status_code == 404


def test_update_content(client):
    r = client.post("/todos", json={"content": "원본"})
    todo_id = r.json()["id"]
    res = client.put(f"/todos/{todo_id}", json={"content": "수정됨"})
    assert res.status_code == 200
    assert res.json()["content"] == "수정됨"


def test_update_done_toggle(client):
    r = client.post("/todos", json={"content": "todo"})
    todo_id = r.json()["id"]
    res = client.put(f"/todos/{todo_id}", json={"done": True})
    assert res.json()["done"] is True
    res = client.put(f"/todos/{todo_id}", json={"done": False})
    assert res.json()["done"] is False


def test_update_partial(client):
    r = client.post("/todos", json={"content": "원본"})
    todo_id = r.json()["id"]
    client.put(f"/todos/{todo_id}", json={"done": True})

    res = client.get(f"/todos/{todo_id}")
    body = res.json()
    assert body["content"] == "원본"
    assert body["done"] is True


def test_update_updated_at_changes(client):
    r = client.post("/todos", json={"content": "초기"})
    todo_id = r.json()["id"]
    initial_updated_at = r.json()["updated_at"]

    import time

    time.sleep(0.01)
    res = client.put(f"/todos/{todo_id}", json={"content": "수정됨"})
    assert res.json()["updated_at"] > initial_updated_at


def test_update_not_found(client):
    res = client.put("/todos/9999", json={"content": "x"})
    assert res.status_code == 404


def test_delete(client):
    r = client.post("/todos", json={"content": "삭제대상"})
    todo_id = r.json()["id"]
    res = client.delete(f"/todos/{todo_id}")
    assert res.status_code == 204

    res = client.get(f"/todos/{todo_id}")
    assert res.status_code == 404


def test_delete_not_found(client):
    res = client.delete("/todos/9999")
    assert res.status_code == 404
