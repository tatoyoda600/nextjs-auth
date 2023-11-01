import UserProfile from '../components/profile/user-profile';
import { auth } from '../lib/auth';

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  const session = await auth(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      }
    };
  }
  
  return {
    props: {
      session: session
    }
  };
}

export default ProfilePage;
