import { useNavigate } from 'react-router-dom';
export default function Navbar() {
	const navigate = useNavigate();
	return (
		<div className='w-screen h-[40px] flex items-center justify-between bg-white px-4'>
			<div className='px-2 font-medium hidden md:block'>U/S Traders</div>
			<div className='flex items-center  bg-white px-4'>
				<Menu text='Purchase' to='purchase' />
				<Menu text='Sales' to='sales' />
				<Menu text='Report' to='report' />
				<Menu text='Add Product' to='add-product' />
			</div>
		</div>
	);
	function Menu(props) {
		return (
			<span
				onClick={(e) => navigate(`/us_inventory/${props.to}`)}
				className='px-2 hover:underline cursor-pointer  font-medium'
			>
				{props.text}
			</span>
		);
	}
}
