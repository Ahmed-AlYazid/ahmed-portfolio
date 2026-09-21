"""Build the public, source-grounded one-page CV PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "Ahmed_Al_Yazid_CV.pdf"
INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#536174")
ACCENT = colors.HexColor("#6843DB")


def style(name, size, *, leading=None, color=INK, bold=False, space_after=0):
    return ParagraphStyle(
        name,
        fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size,
        leading=leading or size * 1.34,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=space_after,
        allowWidows=0,
        allowOrphans=0,
    )


name = style("name", 21, leading=24, bold=True, space_after=3)
role = style("role", 10.5, color=ACCENT, bold=True, space_after=5)
contact = style("contact", 8.7, color=MUTED)
heading = style("heading", 9.2, color=ACCENT, bold=True, space_after=6)
body = style("body", 9.1, leading=12.6, space_after=5)
small = style("small", 8.7, leading=12, space_after=4)
project = style("project", 9.2, leading=12.6, bold=True, space_after=3)


def p(text, paragraph_style=body):
    return Paragraph(text, paragraph_style)


def section(title):
    return [Spacer(1, 10), p(title.upper(), heading), HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#D7E1E8")), Spacer(1, 6)]


def bullet(text):
    return p(f"<font color='#6843DB'>&bull;</font>&nbsp; {text}", small)


story = [
    p("AHMED SAEED AL YAZID", name),
    p("Artificial Intelligence | Machine Learning | Data Science | Computer Vision", role),
    p(
        "Makkah, Saudi Arabia  |  "
        "<link href='mailto:ahmedalyzeed@gmail.com'><font color='#536174'>ahmedalyzeed@gmail.com</font></link>  |  "
        "<link href='https://github.com/Ahmed-AlYazid'><font color='#536174'>github.com/Ahmed-AlYazid</font></link>",
        contact,
    ),
    p(
        "Portfolio: <link href='https://ahmed-portfolio-2e0.pages.dev/'><font color='#6843DB'><u>ahmed-portfolio-2e0.pages.dev</u></font></link>",
        contact,
    ),
]

story += section("Profile")
story.append(p("Artificial Intelligence graduate from Umm Al-Qura University (GPA 3.37/4.00) with experience in controlled computer-vision research, applied machine-learning projects, and a production Arabic educational platform. The linked portfolio includes three browser-based demonstrations built from the documented coursework data and image classes."))

story += section("Education")
story.append(p("<b>B.Sc. Artificial Intelligence</b>  |  Umm Al-Qura University, College of Computing  |  2022-2026  |  GPA 3.37/4.00", small))

story += section("Selected work")
story += [
    KeepTogether([
        p("Educational Supervision Platform  |  Production platform, 2026", project),
        bullet("Built and deployed Arabic RTL workflows for supervision visits, structured records, dashboards, reporting, access control, and document exports."),
        bullet("Cloudflare Pages and Workers, Cloudflare D1, Better Auth, and Backblaze B2. <link href='https://almarefah-supervision.pages.dev/'><font color='#6843DB'><u>Live platform</u></font></link>"),
    ]),
    Spacer(1, 5),
    KeepTogether([
        p("Comparative Deep-Learning Research for Glaucoma Classification  |  Team graduation project, 2025-2026", project),
        bullet("Controlled comparison of six conditions on 4,828 synthetic retinal fundus images with stratified 3-fold cross-validation."),
        bullet("ViT-Small and ResNet-18 feature extraction and fine-tuning; KAN-Transformer and MLP-Transformer trained from scratch. Best reported ResNet18-FT: accuracy 0.963, AUC-ROC 0.996."),
        bullet("Python and PyTorch; calibration, bootstrap confidence intervals, peripheral-occlusion diagnostics, and Attention Rollout."),
    ]),
    Spacer(1, 5),
    KeepTogether([
        p("Interactive academic machine-learning projects", project),
        bullet("Animal image classification across nine documented classes. The portfolio retraining used 827 readable coursework images and achieved 88.9% held-out accuracy with local browser inference."),
        bullet("Diamond price regression from length, width, and depth. Reproduced held-out results: MAE $241, RMSE $329, and R-squared 0.904."),
        bullet("Obesity coursework model audit and a documented decision-tree retraining on the same five inputs and 2,086 records; 89.6% accuracy on a 626-record holdout. Educational use only."),
    ]),
]

story += section("Technical skills")
story.append(p("<b>Languages &amp; data:</b> Python, SQL, Java, Pandas, NumPy, Matplotlib<br/><b>Machine learning:</b> PyTorch, TensorFlow/Keras, scikit-learn, CNNs, Vision Transformers, ResNet, transfer learning<br/><b>Evaluation:</b> cross-validation, AUC-ROC, calibration, bootstrap confidence intervals, explainability<br/><b>Cloud &amp; delivery:</b> Git/GitHub, Cloudflare Pages, Workers, D1, Better Auth, Backblaze B2", small))

story += section("Certifications & languages")
story.append(p("Introduction to Artificial Intelligence and Digital Skills in Artificial Intelligence (Edraak, 2022)  |  Arabic: native  |  English: professional working proficiency", small))

doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=44,
    leftMargin=44,
    topMargin=36,
    bottomMargin=32,
    title="Ahmed Saeed Al Yazid - CV",
    author="Ahmed Saeed Al Yazid",
)
doc.build(story)
print("Built assets/Ahmed_Al_Yazid_CV.pdf")
