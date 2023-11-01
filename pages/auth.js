import AuthForm from '../components/auth/auth-form';
import { auth } from "../lib/auth"

function AuthPage() {
  return <AuthForm />;
}

export async function getServerSideProps(context) {
  const session = await auth(context.req, context.res);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  
  return {
    props: {}
  };
}


export default AuthPage;
