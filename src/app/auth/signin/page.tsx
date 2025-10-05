import { LoginForm } from "./_components/login-form";

export default function SignInPage() {
  return (
    <div className="grid h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div
        className="relative bg-cover bg-center hidden lg:block"
        style={{
          backgroundImage: "url(/images/auth/signin/bg.jpg)",
        }}
      >
        <div className="relative z-10 flex h-full flex-col justify-end bg-black/50 p-10 text-white">
          <h2 className="text-4xl font-bold">Bem-vindo de Volta</h2>
          <p className="mt-4 text-lg">
            Acesse sua conta para gerenciar seus TCCs.
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary">
              Accesse sua conta
            </h1>
            <p className="text-muted-foreground">
              Gestão de documentos e processos de TCC de forma eficiente.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
