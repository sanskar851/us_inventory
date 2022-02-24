import { PAGE } from '../App';
export default function Navbar({ setPage }) {
	return (
		<div className='w-screen h-[40px] flex items-center justify-between bg-white px-4'>
			<div className='px-2 font-medium hidden md:block'>U/S Traders</div>
			<div className='flex items-center  bg-white px-4'>
				<Menu
					text='Purchase'
					onClick={(e) => {
						setPage(PAGE.PURCHASE);
					}}
				/>
				<Menu
					text='Sales'
					onClick={(e) => {
						setPage(PAGE.SALES);
					}}
				/>
				<Menu
					text='Report'
					onClick={(e) => {
						setPage(PAGE.REPORT);
					}}
				/>
				<Menu
					text='Add Product'
					onClick={(e) => {
						setPage(PAGE.ADD_PRODUCT);
					}}
				/>
			</div>
		</div>
	);
}

function Menu(props) {
	return (
		<span onClick={props.onClick} className='px-2 hover:underline cursor-pointer  font-medium'>
			{props.text}
		</span>
	);
}
