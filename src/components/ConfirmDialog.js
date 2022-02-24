import React from 'react';

export default function ConfirmDialog({ products, save, close }) {
	const mounted = React.useRef(true);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	return (
		<div className='w-screen h-screen bg-black/80 absolute top-0 left-0'>
			<div className='w-full h-full flex flex-col items-center px-3'>
				<span className='font-bold text-2xl text-white my-3'>Confirm</span>
				<div className='w-full lg:w-3/4 py-4 px-2 lg:px-4 rounded-xl bg-white'>
					<div className='w-full flex border-[1px]'>
						<span className='w-4/12 text-left px-2 font-medium '>Product Name</span>
						<span className='w-1/12 text-left px-2 font-medium border-l-[1px]'>Price</span>
						<span className='w-2/12 text-left px-2 font-medium border-l-[1px]'>Stock (CBB)</span>
						<span className='w-2/12 text-left px-2 font-medium border-l-[1px]'>Stock (PCS)</span>
						<span className='w-2/12 text-right px-2 font-medium border-l-[1px]'>CBB</span>
						<span className='w-2/12 text-right px-2 font-medium border-l-[1px]'>PCS</span>
						<span className='w-[5px]'></span>
					</div>
					<div
						className='overflow-x-hidden overflow-y-scroll border-[1px]'
						style={{ maxHeight: 'calc(100vh - 220px)' }}
					>
						{products.map((product, index) => {
							if (product.stock > 0) {
								return <Product key={index} detail={product} />;
							} else {
								return <></>;
							}
						})}
					</div>
					<div className='flex justify-between mt-4'>
						<span
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							onClick={(e) => close()}
						>
							Back
						</span>

						<span
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							onClick={(e) => save()}
						>
							Confirm
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function Product({ detail }) {
	return (
		<div className='w-full flex border-b-[1px] border-l-[1px] border-r-[1px] outline-none'>
			<span className='w-4/12 text-left px-2  outline-none '>{detail.name}</span>
			<span className='w-1/12 text-left px-2  border-l-[1px] outline-none'>{detail.price}</span>
			<span className='w-2/12 text-left px-2  border-l-[1px] outline-none'>
				{Math.floor(detail.balance / detail.qty)}
			</span>
			<span className='w-2/12 text-left px-2  border-l-[1px] outline-none'>
				{Math.floor(detail.balance % detail.qty)}
			</span>
			<span className='w-2/12 text-right px-2  border-l-[1px] outline-none'>
				{Math.floor(detail.stock / detail.qty)}
			</span>
			<span className='w-2/12 text-right px-2  border-l-[1px] outline-none'>
				{Math.floor(detail.stock % detail.qty)}
			</span>
		</div>
	);
}
