"""Build the public, source-grounded one-page CV PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "Ahmed_Al_Yazid_CV.pdf"
INK = colors.HexColor("#12243A")
MUTED = colors.HexColor("#4E6072")
ACCENT = colors.HexColor("#087C73")


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
    return p(f"<font color='#087C73'>&bull;</font>&nbsp; {text}", small)


story = [
    p("AHMED SAEED AL YAZID", name),
    p("Artificial Intelligence | Machine Learning | Data Science | Computer Vision", role),
    p("Makkah, Saudi Arabia  |  ahmedalyzeed@gmail.com  |  github.com/Ahmed-AlYazid", contact),
]

story += section("Profile")
story.append(p("Artificial Intelligence graduate from Umm Al-Qura University (GPA 3.37/4.00). Experience includes a team-based comparative computer-vision study and a deployed Arabic educational supervision platform. Works with Python, model evaluation, data analysis, and cloud deployment."))

story += section("Education")
story.append(p("<b>B.Sc. Artificial Intelligence</b>  |  Umm Al-Qura University, College of Computing  |  2022-2026  |  GPA 3.37/4.00", small))

story += section("Selected work")
story += [
    KeepTogether([
        p("Educational Supervision Platform  |  Production platform, 2026", project),
        bullet("Built and deployed Arabic RTL workflows for supervision visits, structured records, dashboards, reporting, access control, and document exports."),
        bullet("Cloudflare Pages and Workers, Cloudflare D1, Better Auth, and Backblaze B2. Live: almarefah-supervision.pages.dev"),
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
        p("Academic machine-learning projects", project),
        bullet("Multi-class animal image classification with a TensorFlow/Keras CNN and augmentation."),
        bullet("Diamond price regression from length, width, and depth with scikit-learn; evaluated with MAE, RMSE, and R-squared."),
        bullet("Obesity-risk classification with one Gaussian Naive Bayes model on selected features and a classification report."),
    ]),
]

story += section("Technical skills")
story.append(p("<b>Languages &amp; data:</b> Python, SQL, Java, Pandas, NumPy, Matplotlib<br/><b>Machine learning:</b> PyTorch, TensorFlow/Keras, scikit-learn, CNNs, Vision Transformers, ResNet, transfer learning<br/><b>Evaluation:</b> cross-validation, AUC-ROC, calibration, bootstrap confidence intervals, explainability<br/><b>Cloud:</b> Cloudflare Pages, Workers, D1, Better Auth, Backblaze B2", small))

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
