import smtplib

def send_mail(to, subject, body):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("pratyushtiwary33@gmail.com","dqursifgtljarkxh")
    message = 'Subject: {}\n\n{}'.format(subject, body)
    s.sendmail("pratyushtiwary33@gmail.com",to,message)
