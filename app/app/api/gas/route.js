export async function POST(req) {
  try {
    const body = await req.json();

    const gasUrl = process.env.APPS_SCRIPT_URL;

    if (!gasUrl) {
      return Response.json({
        success: false,
        message: "APPS_SCRIPT_URL missing in Vercel environment variables"
      });
    }

    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    try {
      return Response.json(JSON.parse(text));
    } catch (err) {
      return Response.json({
        success: false,
        message: "Invalid response from Apps Script",
        raw: text
      });
    }

  } catch (err) {
    return Response.json({
      success: false,
      message: err.message
    });
  }
}
