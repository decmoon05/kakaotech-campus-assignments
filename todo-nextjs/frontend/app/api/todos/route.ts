import { NextRequest, NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import axios from "axios";

export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("filter") ?? undefined;
  const search = req.nextUrl.searchParams.get("search") ?? undefined;

  try {
    const res = await backendApi.get("/todos", { params: { filter, search } });
    return NextResponse.json(res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { detail: err.response?.data?.detail ?? "백엔드 호출 실패" },
        { status: err.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ detail: "알 수 없는 오류" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await backendApi.post("/todos", body);
    return NextResponse.json(res.data, { status: 201 });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { detail: err.response?.data?.detail ?? "생성 실패" },
        { status: err.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ detail: "알 수 없는 오류" }, { status: 500 });
  }
}
