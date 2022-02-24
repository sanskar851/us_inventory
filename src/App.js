import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import AddProduct from './components/AddProduct';
import Purchase from './components/Purchase';
import Sales from './components/Sales';
import Report from './components/Report';
import PurchaseHistory from './components/PurchaseHistory';
import SaleHistory from './components/SaleHistory';

export default function App() {
	return (
		<Router>
			<div className='w-screen h-screen  bg-zinc-100'>
				<Navbar />
				<div className='w-screen  bg-zinc-100' style={{ height: 'calc(100vh - 40px)' }}>
					<Routes>
						<Route exact path='/us_inventory/add-product' element={<AddProduct />}></Route>
						<Route exact path='/us_inventory/purchase' element={<Purchase />}></Route>
						<Route
							exact
							path='/us_inventory/purchase-history'
							element={<PurchaseHistory />}
						></Route>
						<Route exact path='/us_inventory/sales' element={<Sales />}></Route>
						<Route exact path='/us_inventory/sales-history' element={<SaleHistory />}></Route>
						<Route exact path='/us_inventory/report' element={<Report />}></Route>
						<Route exact path='/us_inventory/' element={<Home />}></Route>
						<Route render={() => <Navigate to={`/us_inventory`} />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}
