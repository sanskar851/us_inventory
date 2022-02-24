import React from 'react';
import Axios from '../Controller/Axios';
import { PAGE } from '../App';
import ConfirmDialog from './ConfirmDialog';
const DIALOG = {
	CLOSE: 0,
	OPEN: 1,
};
export default function Sales({ setPage }) {
	const mounted = React.useRef(true);
	const [dialog, openDialog] = React.useState(DIALOG.CLOSE);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const [products, setProducts] = React.useState([]);

	const fetchSearchProducts = React.useCallback(async () => {
		if (!mounted.current) return;
		setProducts([]);
		try {
			const { data } = await Axios.get('/products');
			if (!mounted.current) return;
			setProducts(
				data.map((product) => {
					return { ...product, stock: 0 };
				})
			);
		} catch (e) {
			alert('Error fetching products.');
		}
	}, []);

	React.useEffect(() => {
		fetchSearchProducts();
	}, [fetchSearchProducts]);
	const update = (product, stock) => {
		if (!mounted.current) return;
		setProducts((prev) => {
			return prev.map((p) => {
				if (p.id === product.id) {
					p.stock = Math.min(stock, p.balance);
				}
				return p;
			});
		});
	};

	const handleSave = async () => {
		openDialog(DIALOG.CLOSE);
		try {
			await Axios.post('/sale', { products });
			alert('Sale Complete');
			fetchSearchProducts();
		} catch (e) {
			alert('Unable to sale products');
		}
	};
	return (
		<>
			<div className='w-full h-full flex flex-col items-center px-3'>
				<span className='font-bold text-2xl text-black/70 my-3'>Sales</span>
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
						{products.map((product, index) => (
							<Product
								key={index}
								detail={product}
								update={(stock) => {
									update(product, stock);
								}}
							/>
						))}
					</div>
					<div className='flex justify-between mt-4'>
						<span
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							onClick={(e) => setPage(PAGE.SALES_HISTORY)}
						>
							Search Bill
						</span>

						<span
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							onClick={(e) => openDialog(DIALOG.OPEN)}
						>
							Save
						</span>
					</div>
				</div>
			</div>
			{dialog === DIALOG.OPEN && (
				<ConfirmDialog
					products={products}
					save={handleSave}
					close={(e) => openDialog(DIALOG.CLOSE)}
				/>
			)}
		</>
	);
}

function Product({ detail, update }) {
	const [cbb, setCBB] = React.useState(Math.floor(detail.stock / detail.qty));
	const [pcs, setPCS] = React.useState(Math.floor(detail.stock % detail.qty));

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
			<input
				type='number'
				className='w-2/12 text-right px-2  border-l-[1px] outline-none'
				value={cbb}
				min={0}
				onChange={(e) => {
					setCBB(Math.max(0, e.target.value));
				}}
				onBlur={(e) => {
					let total = cbb * detail.qty + pcs;
					if (total > detail.balance) {
						total = detail.balance;
						setCBB(Math.floor(total / detail.qty));
						setPCS(Math.floor(total % detail.qty));
					}
					update(total);
				}}
			/>
			<input
				type='number'
				className='w-2/12 text-right px-2  border-l-[1px] outline-none'
				value={pcs}
				min={0}
				onChange={(e) => {
					setPCS(Math.max(0, e.target.value));
				}}
				onBlur={(e) => {
					const _pcs = pcs;
					const _cbb = cbb;
					let rem = Math.floor(_pcs / detail.qty);
					if (rem > 0) {
						setCBB((prev) => prev + rem);
						setPCS((prev) => prev % detail.qty);
					}
					let total = _cbb * detail.qty + _pcs;
					if (total > detail.balance) {
						total = detail.balance;
						setCBB(Math.floor(total / detail.qty));
						setPCS(Math.floor(total % detail.qty));
					}
					update(total);
				}}
			/>
		</div>
	);
}
