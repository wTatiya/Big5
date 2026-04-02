from pathlib import Path


def test_smoke():
    assert True


def test_site_assets_exist():
    root = Path(__file__).resolve().parents[1]
    index_path = root / "index.html"
    css_path = root / "assets" / "style.css"

    assert index_path.exists()
    assert css_path.exists()
    assert 'lang="th"' in index_path.read_text(encoding="utf-8")
    assert "Google Sans" in css_path.read_text(encoding="utf-8")


def test_js_exists():
    root = Path(__file__).resolve().parents[1]
    index_path = root / "index.html"
    js_path = root / "assets" / "app.js"
    submission_js = (root / "assets" / "submission.js").read_text(encoding="utf-8")
    workflow = (root / ".github" / "workflows" / "deploy-pages.yml").read_text(encoding="utf-8")
    assert js_path.exists()
    assert (root / "assets" / "submission.js").exists()
    assert (root / "assets" / "submission-config.js").exists()
    assert (root / "google-apps-script" / "Webhook.gs").exists()
    assert (root / ".github" / "workflows" / "deploy-pages.yml").exists()
    assert 'id="big5-quiz"' in index_path.read_text(encoding="utf-8")
    assert "BIG5_OWNER_SUBMISSION_CONFIG" in submission_js
    assert "submitBig5SubmissionToOwner" in submission_js
    assert "BIG5_WEBHOOK_URL" in workflow
    assert "BIG5_WEBHOOK_TOKEN" in workflow
