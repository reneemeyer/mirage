import { Handlers, PageProps } from "$fresh/server.ts";
import LoginForm from "../islands/LoginForm.tsx";

export default function Signup({ data }: PageProps<Data>) {
  return (
    <div>
      <LoginForm isNewUser />
    </div>
  )
}