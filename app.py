from flask import Flask, render_template, request, jsonify, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)

# -----------------------------
# Flask Secret Key
# -----------------------------
app.secret_key = "yojanasetu-secret-key-change-this"

DATABASE = "yojanasetu.db"

ADMIN_KEY = "admin123"


# -----------------------------
# Database Connection
# -----------------------------
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn



# -----------------------------
# Create Tables
# -----------------------------
def init_db():
    

    conn = get_db()

    # Users table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Schemes table
    conn.execute("""
    CREATE TABLE IF NOT EXISTS schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        caste TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        benefit TEXT NOT NULL,
        where_to_apply TEXT NOT NULL,
        apply_url TEXT
    )
""")

    # Add missing columns to old database

    columns = conn.execute(
        "PRAGMA table_info(schemes)"
    ).fetchall()

    column_names = [column["name"] for column in columns]

    if "where_to_apply" not in column_names:
        conn.execute(
            "ALTER TABLE schemes ADD COLUMN where_to_apply TEXT"
        )

    if "apply_url" not in column_names:
        conn.execute(
            "ALTER TABLE schemes ADD COLUMN apply_url TEXT"
        )

    conn.commit()
    
    # Add apply_url column to old database if needed
    columns = conn.execute(
        "PRAGMA table_info(schemes)"
    ).fetchall()

    column_names = [column["name"] for column in columns]

    if "apply_url" not in column_names:
        conn.execute(
            "ALTER TABLE schemes ADD COLUMN apply_url TEXT"
        )
    conn.commit()
        # Add official application link for Rajarshi Shahu EBC scheme


    conn.commit()

    # Rajarshi Shahu EBC application portal
    conn.execute("""
        UPDATE schemes
        SET
            where_to_apply = ?,
            apply_url = ?
        WHERE name LIKE ?
    """, (
        "MahaDBT Portal",
        "https://mahadbt.maharashtra.gov.in/",
        "%Rajarshi%Shahu%"
    ))

    conn.commit()
    # Add demo schemes only if database is empty
    count = conn.execute(
        "SELECT COUNT(*) AS total FROM schemes"
    ).fetchone()["total"]

    if count == 0:

        demo_schemes = [

            (
                "College Student Scholarship",
                "college",
                "All",
                "Scholarship",
                "Financial support for eligible college students.",
                "Students studying in college and meeting scheme conditions.",
                "Financial assistance for education."
            ),

            (
                "Post Matric Scholarship",
                "college",
                "OBC,SC,ST",
                "Scholarship",
                "Post matric scholarship for eligible students.",
                "Students belonging to eligible categories.",
                "Scholarship assistance."
            ),

            (
                "School Education Scholarship",
                "school",
                "All",
                "Scholarship",
                "Education support scheme for school students.",
                "Eligible school students.",
                "Financial support for education."
            ),

            (
                "Pre Matric Scholarship",
                "school",
                "OBC,SC,ST",
                "Scholarship",
                "Scholarship support for eligible school students.",
                "Eligible students before matriculation.",
                "Education assistance."
            ),

            (
                "Farmer Financial Assistance",
                "farmer",
                "All",
                "Financial Support",
                "Financial assistance scheme for farmers.",
                "Eligible farmers.",
                "Financial support."
            ),

            (
                "Agriculture Support Scheme",
                "farmer",
                "All",
                "Financial Support",
                "Support for eligible agricultural activities.",
                "Eligible farmers and agricultural workers.",
                "Agriculture-related support."
            ),

            (
                "Disability Welfare Assistance",
                "disabled",
                "All",
                "Financial Support",
                "Welfare assistance for persons with disabilities.",
                "Eligible persons with disabilities.",
                "Financial assistance."
            ),

            (
                "Senior Citizen Welfare Scheme",
                "senior",
                "All",
                "Pension",
                "Welfare support for eligible senior citizens.",
                "Eligible senior citizens.",
                "Social welfare assistance."
            ),

            (
                "General Welfare Facility",
                "others",
                "All",
                "Financial Support",
                "General welfare assistance.",
                "Eligible citizens.",
                "Welfare support."
            )
        ]

        conn.executemany("""
            INSERT INTO schemes
            (
                name,
                category,
                caste,
                type,
                description,
                eligibility,
                benefit
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, demo_schemes)

        conn.commit()

    conn.close()


# -----------------------------
# Home Page
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html")


# -----------------------------
# Admin Page
# -----------------------------
@app.route("/admin")
def admin():
    return render_template("admin.html")


# -----------------------------
# Signup API
# -----------------------------
@app.route("/api/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    mobile = data.get("mobile", "").strip()
    password = data.get("password", "")

    if not name or not email or not mobile or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    if len(mobile) != 10 or not mobile.isdigit():
        return jsonify({
            "success": False,
            "message": "Enter valid 10 digit mobile number."
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 6 characters."
        }), 400

    conn = get_db()

    existing = conn.execute("""
        SELECT id FROM users
        WHERE email = ? OR mobile = ?
    """, (email, mobile)).fetchone()

    if existing:
        conn.close()

        return jsonify({
            "success": False,
            "message": "Email or mobile already registered."
        }), 400

    hashed_password = generate_password_hash(password)

    conn.execute("""
        INSERT INTO users
        (name, email, mobile, password)
        VALUES (?, ?, ?, ?)
    """, (
        name,
        email,
        mobile,
        hashed_password
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Account created successfully."
    })


# -----------------------------
# Login API
# -----------------------------
@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    login_value = data.get("login", "").strip().lower()
    password = data.get("password", "")

    conn = get_db()

    user = conn.execute("""
        SELECT * FROM users
        WHERE email = ? OR mobile = ?
    """, (
        login_value,
        login_value
    )).fetchone()

    conn.close()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 401

    if not check_password_hash(user["password"], password):
        return jsonify({
            "success": False,
            "message": "Incorrect password."
        }), 401

    session["user_id"] = user["id"]
    session["user_name"] = user["name"]

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "name": user["name"]
    })


# -----------------------------
# Logout
# -----------------------------
@app.route("/api/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    })


# -----------------------------
# Current User
# -----------------------------
@app.route("/api/me")
def current_user():

    if "user_id" not in session:
        return jsonify({
            "loggedIn": False
        })

    return jsonify({
        "loggedIn": True,
        "name": session.get("user_name")
    })


# -----------------------------
# Get Schemes
# -----------------------------
@app.route("/api/schemes")
def get_schemes():

    category = request.args.get("category")
    caste = request.args.get("caste")

    conn = get_db()

    query = "SELECT * FROM schemes WHERE 1=1"
    params = []

    if category:
        query += " AND category = ?"
        params.append(category)

    schemes = conn.execute(query, params).fetchall()

    conn.close()

    result = []

    for scheme in schemes:

        scheme_caste = scheme["caste"]

        allowed_castes = [
            x.strip().lower()
            for x in scheme_caste.split(",")
        ]

        if (
            not caste
            or "all" in allowed_castes
            or caste.lower() in allowed_castes
        ):

            result.append({
                "id": scheme["id"],
                "name": scheme["name"],
                "category": scheme["category"],
                "caste": scheme["caste"],
                "type": scheme["type"],
                "description": scheme["description"],
                "eligibility": scheme["eligibility"],
                "benefit": scheme["benefit"]
            })

    return jsonify(result)


# -----------------------------
# Admin Authentication
# -----------------------------
def admin_required(func):

    @wraps(func)
    def wrapper(*args, **kwargs):

        key = request.headers.get("X-Admin-Key")

        if key != ADMIN_KEY:
            return jsonify({
                "success": False,
                "message": "Unauthorized admin access."
            }), 401

        return func(*args, **kwargs)

    return wrapper


# -----------------------------
# Add Scheme
# -----------------------------
@app.route("/api/admin/schemes", methods=["POST"])
@admin_required
def add_scheme():

    data = request.get_json()

    name = data.get("name", "").strip()
    category = data.get("category", "").strip()
    caste = data.get("caste", "").strip()
    scheme_type = data.get("type", "").strip()
    description = data.get("description", "").strip()
    eligibility = data.get("eligibility", "").strip()
    benefit = data.get("benefit", "").strip()

    if not all([
        name,
        category,
        caste,
        scheme_type,
        description,
        eligibility,
        benefit
    ]):
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    conn = get_db()

    conn.execute("""
        INSERT INTO schemes
        (
            name,
            category,
            caste,
            type,
            description,
            eligibility,
            benefit
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        name,
        category,
        caste,
        scheme_type,
        description,
        eligibility,
        benefit
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Scheme added successfully."
    })


# -----------------------------
# Delete Scheme
# -----------------------------
@app.route("/api/admin/schemes/<int:scheme_id>", methods=["DELETE"])
@admin_required
def delete_scheme(scheme_id):

    conn = get_db()

    conn.execute(
        "DELETE FROM schemes WHERE id = ?",
        (scheme_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Scheme deleted successfully."
    })


# -----------------------------
# Start Flask
# -----------------------------
if __name__ == "__main__":

    init_db()

    app.run(
        debug=True
    )
    