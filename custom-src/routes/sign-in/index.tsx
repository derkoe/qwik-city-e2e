import { component$ } from "@builder.io/qwik";
import {
  action$,
  DocumentHead,
  Form,
  RequestHandler,
} from "@builder.io/qwik-city";
import {
  AUTHTOKEN_COOKIE_NAME,
  USER_COOKIE_NAME,
  isUserAuthenticated,
} from "../../auth/auth";

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
  if (await isUserAuthenticated(cookie)) {
    throw redirect(302, "/dashboard/");
  }
};

export const signinAction = action$(
  async ({ username, password }, { cookie, redirect, fail }) => {
    if (username == "qwik" && password == "dev") {
      // super secret username/password (Testing purposes only, DO NOT DO THIS!!)
      cookie.set(AUTHTOKEN_COOKIE_NAME, Math.round(Math.random() * 9999999), {
        httpOnly: true,
        maxAge: [5, "minutes"],
        path: "/",
      });

      cookie.set(USER_COOKIE_NAME, username, {
        // NOT httpOnly so that document.cookie can get this value
        // httpOnly: true,
        maxAge: [5, "minutes"],
        path: "/",
      });

      throw redirect(301, "/dashboard/");
    }

    return fail(403, {
      message: "Invalid username or password",
    });
  }
);

export const resetPasswordAction = action$(async () => {
  console.warn("resetPasswordAction");
});

export default component$(() => {
  const signIn = signinAction.use();
  const resetPassword = resetPasswordAction.use();

  return (
    <>
      <h1>Sign In</h1>

      <Form action={signIn} data-test="sign-in">
        {signIn.fail?.message && <p style="color:red">{signIn.fail.message}</p>}
        <p>
          <span>Username: </span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            autoFocus
            required
          />
        </p>
        <p>
          <span>Password: </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </p>
        <p>
          <button type="submit">Sign In</button>
        </p>
        <p>(Username: qwik, Password: dev)</p>
      </Form>

      <hr />

      <h2>Reset Password</h2>

      <form
        method="post"
        action={resetPassword.actionPath}
        data-test="reset-password"
      >
        <p>
          <span>Email: </span>
          <input name="email" type="text" required />
        </p>
        <p>
          <button data-test-reset-password>Reset Password</button>
        </p>
      </form>
    </>
  );
});

export const head: DocumentHead = {
  title: "Sign In",
};