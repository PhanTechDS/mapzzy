from flask import Flask, render_template, redirect, request, abort
from models import db, Base, dbsession
from models.user import User
from models.pass_reset import PassReset
from hashlib import sha256
from sqlalchemy import select
from utils import email, phone
from uuid import uuid4
from utils.mailer import send_mail
from config import url
from utils import msg, session

app = Flask(__name__)


Base.metadata.create_all(db)

@app.route("/")
def index():
    return redirect("https://www.google.com",code=302)

@app.route('/api/login',methods=["GET","POST"])
def login():
    if request.method == "POST":
        email = request.json.get("email")
        password = request.json.get("password")
        password = sha256(bytes(password,encoding="utf-8")).hexdigest()
        user = select(User).where(User.email == email)
        res = dbsession.execute(user).fetchone()
        if res:
            res = res[0]
            real_pass = res.password
            if real_pass == password:
                return msg.success({
                    "token": session.generate({"email": email})
                })
            else:
                return msg.error("Wrong password")
        else:
            return msg.error("Email not found!")

@app.route("/api/register",methods=["GET","POST"])
def register():
    if request.method == "POST":
        em = request.json.get("email")
        ph = request.json.get("phone")
        name = request.json.get("name")
        password = request.json.get("password")
        cpassword = request.json.get("cpassword")
        if not phone.match(ph):
            return msg.error("Invalid Phone Number")

        if not email.match(em):
            return msg.error("Invalid Email")

        if password != cpassword:
            return msg.error("Passwords do not match")

        try:
            user = User(em,password,name,ph)
            dbsession.add(user)
            dbsession.commit()
        except Exception as e:
            return msg.error("Email already exists!")

        return msg.success("Registration Successful!")

    return render_template("register.html")

@app.route("/api/verify",methods=["GET","POST"])
def Verify():
    if request.method == "POST":
        token = request.json.get("token")
        data = session.verify(token)
        if data:
            return msg.success(data)
        else:
            return msg.error("Invalid Token")

@app.route("/api/forget_password",methods=["GET","POST"])
def forget_password():
    if request.method == "POST":
        email = request.json.get("email")
        user = select(User).where(User.email == email)
        res = dbsession.execute(user).fetchone()
        if res:
            token = str(uuid4())
            old_reset = select(PassReset).where(PassReset.usr_id == res[0].id)
            res_pass = dbsession.execute(old_reset).fetchone()
            if res_pass:
                res_pass[0].reset_id = token
                send_mail(email,"Password Reset","Click on the link to reset your password: "+url+"reset/"+token)
            else:
                pass_reset = PassReset(res[0].id,token)
                send_mail(email,"Password Reset","Click on the link to reset your password: "+url+"reset/"+token)
                dbsession.add(pass_reset)
            dbsession.commit()
            return msg.success("Password reset link sent to your email")
        else:
            return msg.error("Email not found!")
    else:
        return render_template("forget_password.html")

@app.route("/reset/<token>",methods=["GET","POST"])
def reset_pass(token):
    t = select(PassReset).where(PassReset.reset_id == token)
    res_pass_reset = dbsession.execute(t).fetchone()
    if res_pass_reset:
        if request.method == "POST":
            password, cpass = request.form.get("password"), request.form.get("cnfpassword")
            if password != cpass:
                return render_template("reset.html",error="Passwords do not match")

            user = select(User).where(User.id == res_pass_reset[0].usr_id)
            res = dbsession.execute(user).fetchone()
            res[0].password = sha256(bytes(password,encoding="utf-8")).hexdigest()
            dbsession.delete(res_pass_reset[0])
            dbsession.commit()
            return render_template("reset.html",success="Password reset successful!")
        return render_template("reset.html")
    else:
        abort(404)

@app.after_request
def add_header(r):
    header = r.headers
    header["Access-Control-Allow-Origin"] = "*"
    header["Access-Control-Allow-Headers"] = "*"
    header["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE"
    return r


if __name__ == '__main__':
    app.run(debug=True)