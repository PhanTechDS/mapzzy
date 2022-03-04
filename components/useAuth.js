export default function useAuth() {
  const options = {};

  options.isLoggedIn = function () {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  };

  options.verifyLogin = function (requestMethod, err, success) {
    requestMethod("verify", {
      token: localStorage.getItem("token"),
    })
      .then((c) => {
        if (!c) {
          localStorage.removeItem("token");
          err();
        } else {
          success(c);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        err();
      });
  };

  options.login = function (token) {
    localStorage.setItem("token", token);
  };

  options.logout = function () {
    localStorage.removeItem("token");
  };

  return options;
}
