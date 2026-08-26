import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel(
#     "gemini-3.6-flash",
#     generation_config={"temperature": 0.2},
# )

model = genai.GenerativeModel(
    "gemini-3.1-flash-lite",
    generation_config={"temperature": 0.2},
)

PROMPT_TEMPLATE = """
You are an expert technical recruiter and resume analyst. Compare the following RESUME against the JOB DESCRIPTION and return a structured analysis.

RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}

Return ONLY valid JSON, with no extra text, no markdown formatting, no code fences — just the raw JSON object, in exactly this shape:

{{
  "match_score": <integer 0-100>,
  "matching_points": ["skill or requirement present in both resume and JD", ...],
  "missing_points": [
    {{
      "skill": "name of the missing requirement",
      "importance": "critical" | "important" | "nice-to-have"
    }},
    ...
  ],
  "suggestions": [
    {{
      "missing_skill": "name of the missing skill",
      "suggestion": "concrete, specific advice on how to address this gap"
    }},
    ...
  ]
}}

Rules:
- First, extract the full list of requirements from the JD (skills, tools, experience level, education, etc.) and privately classify each as "critical" (explicitly required, core to the role), "important" (strongly preferred, appears prominently), or "nice-to-have" (bonus/preferred but optional). Do not show this extraction — only use it to inform missing_points and match_score.
- Credit implied skills, not just exact keyword matches. If the resume lists a specific tool, framework, or project that reasonably requires a JD skill, count that skill as present even if the exact phrase never appears. Examples: Express.js or Node.js implies REST API development; a React project implies component-based UI development; a project with a database implies data modeling. Only mark a skill as missing if there is genuinely no reasonable evidence for it anywhere in the resume — not merely because the exact wording differs.
- Compute match_score using this logic, not a general impression: start from the proportion of "critical" requirements the resume satisfies, then adjust up slightly for "important" and "nice-to-have" requirements met. A resume missing even one or two "critical" requirements should score no higher than 60-65, regardless of how strong the rest of the resume is. Reserve 85+ for resumes with all critical requirements met and most important ones met. A resume missing several critical requirements should score below 40.
- List 4-8 matching_points and 2-6 missing_points, ranked by importance to the role (critical first).
- Each suggestion must be specific and actionable, not generic advice.
- Do not include any text outside the JSON object.
"""

def analyze_resume_vs_jd(resume_text: str, jd_text: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(resume_text=resume_text, jd_text=jd_text)
    response = model.generate_content(prompt)
    raw_text = response.text.strip()

    # Strip markdown code fences if Gemini adds them despite instructions
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        raise ValueError(f"AI did not return valid JSON: {raw_text[:300]}")

    return result