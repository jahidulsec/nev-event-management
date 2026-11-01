import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import mime from "mime-types";

export async function GET(
    req: NextRequest,
) {
    const file_path = req.nextUrl.searchParams.get("file_path");

    // if file does not found
    if (!file_path) {
        return NextResponse.json({ error: "enter a file path" }, { status: 400 });
    }

    // get file path
    const filePath = path.join(/*turbopackIgnore: true*/ process.cwd() + file_path);


    // check if file exists in dir
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const stat = fs.statSync(/*turbopackIgnore: true*/ filePath);
    const fileSize = stat.size;

    console.log(fileSize)

    const ext = path.extname(filePath);
    const contentType =
        mime.lookup(ext) || "application/octet-stream";

    // ===============================
    // 🔹 NORMAL FILE RESPONSE
    // ===============================
    const stream = fs.readFileSync(/*turbopackIgnore: true*/ filePath);

    return new NextResponse(stream as any, {
        headers: {
            "Content-Type": contentType,
            "Content-Length": String(fileSize),
            "Content-Disposition":
                `attachment; filename="${file_path.split('/').pop()}"`,
            "Cache-Control": "no-store",
            "Accept-Ranges": "none",
        },
    });
}
