import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { db } from "@/config/db";
import { Params } from "@/types/search-params";

export async function GET(
    req: NextRequest,
    { params }: { params: Params }
) {
    const { id } = await params;


    const file = await db.event_attachment.findUnique({
        where: {
            id: id?.toString()
        }
    })

    // if file does not found
    if (!file) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // get file path
    const filePath = file.file_path ?? '';


    // Find file with any extension
    const fileName = file.document_title

    // check if file exists in dir
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    console.log(fileSize)

    const ext = path.extname(filePath);
    const contentType =
        mime.lookup(ext) || "application/octet-stream";

    const range = req.headers.get("range");
    const isStreamable =
        contentType.startsWith("audio") ||
        contentType.startsWith("video");

    // ===============================
    // 🔹 RANGE SUPPORT (audio / video)
    // ===============================
    if (range && isStreamable) {
        const [startStr, endStr] = range.replace("bytes=", "").split("-");
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
            return new NextResponse(null, { status: 416 });
        }

        const chunkSize = end - start + 1;
        const stream = fs.createReadStream(filePath, { start, end });

        return new NextResponse(stream as any, {
            status: 206,
            headers: {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": String(chunkSize),
                "Content-Type": contentType,
            },
        });
    }

    // ===============================
    // 🔹 NORMAL FILE RESPONSE
    // ===============================
    const stream = fs.createReadStream(filePath);

    const isInline =
        contentType.startsWith("image") ||
        contentType === "application/pdf" ||
        contentType.startsWith("audio") ||
        contentType.startsWith("video");

    return new NextResponse(stream as any, {
        headers: {
            "Content-Type": contentType,
            "Content-Length": String(fileSize),
            "Content-Disposition": isInline
                ? "inline"
                : `attachment; filename="${fileName}"`,
            "Cache-Control": "no-store",
            "Accept-Ranges": isStreamable ? "bytes" : "none",
        },
    });
}
