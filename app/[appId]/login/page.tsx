import LoginComponents from "@/components/auth/login";
import React from "react";

const Login = ({ params }: { params: { appId: string } }) => {
  const { appId } = params
  console.log(appId);

  return (
    <div>
      <LoginComponents appId={appId} />
    </div>
  );
};

export default Login;
