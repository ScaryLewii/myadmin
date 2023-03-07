import Link from "next/link";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const Navbar = () => {
	const route = useRouter()

	const linkStyle = "block py-2 pr-4 pl-3 font-semibold hover:text-slate-800";
	const urls = [
		{ label: "Calendar", href: "/" },
		{ label: "Staffs", href: "/todolist" },
		{ label: "Clients", href: "/todolist" },
		{ label: "Services", href: "/todolist" },
		{ label: "Report", href: "/todolist" },
	]

	return (
		<header className="sticky top-0 z-50 bg-orange-100 px-4 py-2.5 flex flex-wrap justify-between items-center mx-auto">
			<div className="logo">
				<Link href="/" title="MyBeautyAdmin">
					<Image src="/logo.svg" height={32} width={32} style={{ width: 32, height: 32 }} alt="MyBeauty Admin" />
				</Link>
			</div>
			<ul className="flex flex-row space-x-8 mt-0">
				{
				urls.map( url => (
					<li key={ uuidv4() }>
						<Link className={`${linkStyle} ${route.pathname == url.href ? "text-slate-800" : "text-slate-400"}`} href={ url.href }>
							{ url.label }
						</Link>
					</li>
				) )
				}
			</ul>
		</header>
	)
}

export default Navbar