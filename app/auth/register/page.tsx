import RegisterForm from '../../../components/auth/register-form';

/**
 * Renders the registration page for new users.
 * This page displays the RegisterForm component, centered on the screen.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}