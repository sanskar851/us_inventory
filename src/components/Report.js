import React from 'react';
import Axios from '../Controller/Axios';

export default function Report() {
	const [products, setProducts] = React.useState([]);
	const mounted = React.useRef(true);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	React.useEffect(() => {
		async function fetchSearchProducts() {
			try {
				const { data } = await Axios.get('/report');
				if (mounted.current) setProducts(data);
			} catch (e) {
				alert('Error fetching products.');
			}
		}
		fetchSearchProducts();
	}, []);

	return (
		<>
			<div className='w-full h-full flex flex-col items-center px-3'>
				<span className='font-bold text-2xl text-black/70 my-3'>Report</span>
				<div className='w-full lg:w-3/4 py-4 px-2 lg:px-4 rounded-xl bg-white'>
					<div className='w-full flex border-[1px]'>
						<span className='w-4/12 text-left md:px-2 font-medium '>Product Name</span>
						<span className='w-1/12 text-left md:px-2 font-medium border-l-[1px]'>Price</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>
							Opening Stock (CBB - PCS)
						</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>Purchase</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>Sales</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>
							Closing Stock (CBB - PCS)
						</span>
						<span className='w-[5px]'></span>
					</div>
					<div
						className='overflow-x-hidden overflow-y-scroll border-[1px]'
						style={{ maxHeight: 'calc(100vh - 220px)' }}
					>
						{products.map((product, index) => (
							<Product key={index} detail={product} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function Product({ detail }) {
	return (
		<div className='w-full flex border-b-[1px] border-l-[1px] border-r-[1px] outline-none'>
			<span className='w-4/12 text-left px-2  outline-none '>{detail.name}</span>
			<span className='w-1/12 text-left px-2  border-l-[1px] outline-none'>{detail.price}</span>
			<span className='w-2/12 text-left px-2 flex-center border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>
					{Math.floor((detail.closingbalance - detail.purchase + detail.sales) / detail.qty)}
				</span>
				<span>-</span>
				<span className='w-1/2 text-center'>
					{Math.floor((detail.closingbalance - detail.purchase + detail.sales) % detail.qty)}
				</span>
			</span>
			<span className='w-2/12 text-left px-2 flex-center border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>{Math.floor(detail.purchase / detail.qty)}</span>
				<span>-</span>
				<span className='w-1/2 text-center'>{Math.floor(detail.purchase % detail.qty)}</span>
			</span>
			<span className='w-2/12 text-left px-2 flex-center border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>{Math.floor(detail.sales / detail.qty)}</span>
				<span>-</span>
				<span className='w-1/2 text-center'>{Math.floor(detail.sales % detail.qty)}</span>
			</span>
			<span className='w-2/12 flex-center px-2  border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>{Math.floor(detail.closingbalance / detail.qty)}</span>
				<span>-</span>
				<span className='w-1/2 text-center'>{Math.floor(detail.closingbalance % detail.qty)}</span>
			</span>
		</div>
	);
}
