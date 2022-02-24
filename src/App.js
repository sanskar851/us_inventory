import React from 'react';
import Home from './components/Home';
import Navbar from './components/Navbar';
import AddProduct from './components/AddProduct';
import Purchase from './components/Purchase';
import Sales from './components/Sales';
import Report from './components/Report';
import PurchaseHistory from './components/PurchaseHistory';
import SaleHistory from './components/SaleHistory';

const PAGE = {
	HOME: 0,
	ADD_PRODUCT: 1,
	PURCHASE: 2,
	SALES: 3,
	SALES_HISTORY: 4,
	PURCHASE_HISTORY: 5,
	REPORT: 6,
};
export default function App() {
	const [page, setPage] = React.useState(PAGE.HOME);
	return (
		<div className='w-screen h-screen  bg-zinc-100'>
			<Navbar setPage={setPage} />
			<div className='w-screen  bg-zinc-100' style={{ height: 'calc(100vh - 40px)' }}>
				{page === PAGE.HOME && <Home />}
				{page === PAGE.ADD_PRODUCT && <AddProduct />}
				{page === PAGE.PURCHASE && <Purchase />}
				{page === PAGE.SALES && <Sales />}
				{page === PAGE.SALES_HISTORY && <SaleHistory />}
				{page === PAGE.PURCHASE_HISTORY && <PurchaseHistory />}
				{page === PAGE.REPORT && <Report />}
			</div>
		</div>
	);
}
export { PAGE };
