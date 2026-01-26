import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        <div>
          <h3 className="text-2xl font-black italic tracking-tighter mb-6">
            EVO<span className="text-red-600">PRIMAL</span>
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6">
            Suplementação de alta performance para atletas que exigem o máximo de si mesmos e dos seus treinos.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <div
                key={i}
                className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-red-600 transition cursor-pointer"
              >
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Navegação</h4>
          <ul className="space-y-3 text-zinc-500 text-sm">
            {["Início", "Produtos", "Categorias", "Blog"].map((item) => (
              <li key={item} className="hover:text-red-600 cursor-pointer transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Ajuda</h4>
          <ul className="space-y-3 text-zinc-500 text-sm">
            {["Trocas", "Frete", "Contato", "Privacidade"].map((item) => (
              <li key={item} className="hover:text-red-600 cursor-pointer transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Pagamento Seguro</h4>
          <div className="grid grid-cols-3 gap-2 opacity-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-white/10 rounded" />
            ))}
          </div>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-xs">
          © 2026 EVOPRIMAL. Todos os direitos reservados.
        </p>
        <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          Desenvolvido com <span className="text-red-600">❤</span> e Cafeína
        </p>
      </div>
    </footer>
  );
}