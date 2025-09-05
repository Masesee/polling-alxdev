import LoginForm from '../../../components/auth/login-form';

/**
 * Renders the login page for the application.
 * This page displays the LoginForm component, centered on the screen.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}