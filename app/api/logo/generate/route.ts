import { NextRequest, NextResponse } from "next/server";
const { generateLogoBatch } = require("@/src/logo-backend");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await generateLogoBatch(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Lỗi tạo phương án logo" },
      { status: 500 }
    );
  }
}

