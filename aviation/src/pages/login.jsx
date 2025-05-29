import { LoginForm } from '@/components/login-form';

const LoginPage = ({setUser}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Mickey Mouse Doc Center</h1>
          <p className="text-muted-foreground">Sign in to access your account</p>
        </div>
        <LoginForm setUser={setUser}/>
      </div>
    </div>
  );
}

export default LoginPage