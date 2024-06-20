import { useReceivedBills } from '../api/bills'
import { useState } from 'react'
import Modal from './modal'

const DOLAR_TO_CLP_FACTOR = 800

const ClpToDolar = (clp) => {
	return clp / DOLAR_TO_CLP_FACTOR
}

const DolarToClp = (dolar) => {
	return dolar * DOLAR_TO_CLP_FACTOR
}

export default function Bills() {
	const { data: receivedBills, isError, error, isLoading } = useReceivedBills()
	const [billSelected, setBillSelected] = useState(null)
	const [creditNoteSelected, setCreditNoteSelected] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)
	const handleBillSelected = (billId) => {
		setBillSelected(billId)
		setCreditNoteSelected(null)
	}
	const handleCreditNoteSelected = (billId) => {
		setCreditNoteSelected(billId)
	}
	const handleOpenModal = () => {
		setModalOpen(true)
	}
	const HandleCloseModal = () => {
		setModalOpen(false)
		setBillSelected(null)
		setCreditNoteSelected(null)
	}

	const bills = receivedBills
		? receivedBills.filter((bill) => bill.type === 'received')
		: null
	const creditNotes = receivedBills
		? receivedBills.filter(
				(bill) => bill.type === 'credit_note' && bill.reference === billSelected
		  )
		: null
	return (
		<div className="text-center w-full">
			<h1 className="font-bold text-xl mb-4">Selecciona una factura</h1>
			{isLoading ? (
				<p>Cargando...</p>
			) : isError ? (
				<p>Algo salió mal:{error.message}</p>
			) : bills ? (
				<ul
					className="flex flex-col w-auto items-center mx-16 border border-gray-200 rounded-lg
                "
				>
					{bills.map((bill, index) => (
						<li
							key={bill.id}
							className={`flex w-full justify-between p-2 ${
								index !== bills.length - 1 ? 'border-b border-gray-300' : ''
							} ${billSelected === bill.id ? 'bg-indigo-100' : ''}`}
						>
							<div className="flex items-center">
								<input
									type="radio"
									name="selectedBill"
									value={bill.id}
									checked={billSelected === bill.id}
									onChange={() => handleBillSelected(bill.id)}
									className="form-radio mx-4"
								/>
								<p className="font-bold">{bill.id} </p>
								<p className="text-gray-400 ml-1">({bill.organization_id})</p>
							</div>
							<div className="flex">
								<p className="text-black-400">
									$
									{bill.currency === 'CLP'
										? bill.amount
										: DolarToClp(bill.amount)}{' '}
									CLP
								</p>
								<p className="text-gray-400 ml-1">
									($
									{bill.currency === 'USD'
										? bill.amount
										: ClpToDolar(bill.amount)}{' '}
									USD)
								</p>
							</div>
							<div>
								<p className="text-gray-400">Recibida</p>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p>No se encontraron facturas</p>
			)}

			{billSelected ? (
				creditNotes && creditNotes.length > 0 ? (
					<div>
						<h1 className="font-bold text-xl my-4">
							Selecciona una nota de crédito
						</h1>
						<ul
							className="flex flex-col w-auto items-center mx-16 border border-gray-200 rounded-lg
            "
						>
							{creditNotes.map((bill, index) => (
								<li
									key={bill.id}
									className={`flex w-full justify-between p-2 ${
										index !== creditNotes.length - 1
											? 'border-b border-gray-300'
											: ''
									} ${creditNoteSelected === bill.id ? 'bg-indigo-100' : ''}`}
								>
									<div className="flex items-center">
										<input
											type="radio"
											name="selectedCreditNote"
											value={bill.id}
											checked={creditNoteSelected === bill.id}
											onChange={() => handleCreditNoteSelected(bill.id)}
											className="form-radio mx-4"
										/>
										<p className="font-bold">{bill.id}</p>
										<p className="text-gray-400">({bill.organization_id})</p>
									</div>
									<div className="flex">
										<p className="font-bold">
											{bill.currency === 'CLP'
												? bill.amount
												: DolarToClp(bill.amount)}{' '}
											CLP
										</p>
										<p className="text-gray-400">
											($
											{bill.currency === 'USD'
												? bill.amount
												: ClpToDolar(bill.amount)}{' '}
											USD)
										</p>
									</div>
									<div>
										<p className="text-gray-400">{bill.type}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				) : (
					<h1 className="font-bold text-xl my-4">
						Esta factura no tiene nota de crédito asociada
					</h1>
				)
			) : null}

			{creditNoteSelected ? (
				<div>
					<button
						className="bg-indigo-500 text-white rounded-lg p-2 mt-4"
						onClick={handleOpenModal}
					>
						Asignar
					</button>
					<Modal
						isOpen={modalOpen}
						onClose={HandleCloseModal}
						text="Nota de crédito asignada correctamente"
					>
						{/* Modal content */}
						<p className="text-gray-700">This is the modal content.</p>
					</Modal>
				</div>
			) : null}
		</div>
	)
}
