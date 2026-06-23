import { NextRequest, NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import axios from "axios";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ todoId: string }> },
) {
  const { todoId } = await params;
  const body = await req.json();

  try {
    const res = await backendApi.put(`/todos/${todoId}`, body);
    return NextResponse.json(res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { detail: err.response?.data?.detail ?? "수정 실패" },
        { status: err.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ detail: "알 수 없는 오류" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ todoId: string }> },
) {
  const { todoId } = await params;

  try {
    await backendApi.delete(`/todos/${todoId}`);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { detail: err.response?.data?.detail ?? "삭제 실패" },
        { status: err.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ detail: "알 수 없는 오류" }, { status: 500 });
  }
}
