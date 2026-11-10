import { NextRequest, NextResponse } from "next/server";
import { approveAndPublishProject } from "../../../../../lib/curationService";
import { ProjectRecord } from "../../../../../types/curation";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();

    // Chuẩn hóa dữ liệu từ body (hỗ trợ cả dạng payload Section III lẫn direct project fields)
    let updateFields: Partial<ProjectRecord> = {};

    if (body.final_data) {
      updateFields = {
        brand_story: body.final_data.brand_story,
        tagline: body.final_data.tagline,
        palette: body.final_data.palette,
        typography: body.final_data.typography,
        logo_svg: body.final_data.final_logo_svg || body.final_data.logo_svg,
        order_tier: body.order_tier || body.final_data.order_tier,
        delivery_mode: body.delivery_mode || body.final_data.delivery_mode,
        selected_logo_id: body.selected_logo_id || body.final_data.selected_logo_id,
        logo_options: body.logo_options || body.final_data.logo_options
      };
    } else {
      updateFields = {
        brand_story: body.brand_story,
        tagline: body.tagline,
        palette: body.palette,
        typography: body.typography,
        logo_svg: body.logo_svg,
        logo_layout: body.logo_layout,
        mockups: body.mockups,
        order_tier: body.order_tier,
        delivery_mode: body.delivery_mode,
        selected_logo_id: body.selected_logo_id,
        logo_options: body.logo_options
      };
    }

    const result = await approveAndPublishProject(projectId, updateFields);

    // Format response matching Section III specification
    const responsePayload = {
      project_id: projectId,
      status: "Approved",
      approved_at: result.project.approved_at,
      order_tier: result.project.order_tier,
      delivery_mode: result.project.delivery_mode,
      selected_logo_id: result.project.selected_logo_id,
      final_data: {
        brand_story: result.project.brand_story,
        tagline: result.project.tagline,
        palette: result.project.palette.map((c) => ({
          role: c.role,
          hex: c.hex,
          name: c.name
        })),
        typography: {
          heading: result.project.typography.heading,
          body: result.project.typography.body
        },
        final_logo_svg: result.project.logo_svg,
        export_links: result.export_links
      }
    };

    return NextResponse.json({
      success: true,
      message: `Dự án ${projectId} đã được phê duyệt và xuất bản trọn bộ tài sản thương hiệu!`,
      data: responsePayload
    });
  } catch (error: any) {
    console.error("Lỗi khi phê duyệt dự án:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
