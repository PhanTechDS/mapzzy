from ast import Pass
from flask import Flask, render_template, redirect, session, request, abort
from flask_session import Session
from models import db, Base, dbsession
from models.user import User
from models.pass_reset import PassReset
from hashlib import sha256
from sqlalchemy import select
from utils import email, phone
from uuid import uuid4
from utils.mailer import send_mail
from config import url

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

Session(app)

Base.metadata.create_all(db)

@app.route('/')
def home():
    email = session.get("email")
    logged_in = email!=None
    return render_template('home.html',logged_in=logged_in)

@app.route('/login',methods=["GET","POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        password = sha256(bytes(password,encoding="utf-8")).hexdigest()
        user = select(User).where(User.email == email)
        res = dbsession.execute(user).fetchone()
        if res:
            res = res[0]
            real_pass = res.password
            if real_pass == password:
                session["email"] = email
                return redirect("/")
            else:
                return render_template("login.html",email=email,error="Please recheck your password!")
        else:
            return render_template("login.html",email=email,em_error="Email not found!")
    else:
        return render_template('login.html')

@app.route("/register",methods=["GET","POST"])
def register():
    if request.method == "POST":
        em = request.form.get("email")
        ph = request.form.get("phone")
        name = request.form.get("name")
        password = request.form.get("password")
        cpassword = request.form.get("cpassword")
        if not phone.match(ph):
            return render_template("register.html",email=em,phone=ph,name=name,error="Invalid Phone Number")

        if not email.match(em):
            return render_template("register.html",email=em,phone=ph,name=name,error="Invalid Email")

        if password != cpassword:
            return render_template("register.html",email=em,phone=ph,name=name,error="Passwords do not match")

        try:
            user = User(em,password,name,ph)
            dbsession.add(user)
            dbsession.commit()
        except Exception as e:
            return render_template("register.html",email=em,phone=ph,name=name,error="Email already exists!")

        return render_template("register.html",success="Registration Successful!")

    return render_template("register.html")

@app.route("/forget_password",methods=["GET","POST"])
def forget_password():
    if request.method == "POST":
        email = request.form.get("email")
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
            return render_template("forget_password.html",success="Password reset link sent to your email")
        else:
            return render_template("forget_password.html",error="Email not found!")
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

if __name__ == '__main__':
    app.run(debug=True)