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
	const handleBillSelected = (bill) => {
		setBillSelected(bill)
		setCreditNoteSelected(null)
	}
	const handleCreditNoteSelected = (bill) => {
		setCreditNoteSelected(bill)
	}
	const handleOpenModal = () => {
		setModalOpen(true)
	}
	const HandleCloseModal = () => {
		setModalOpen(false)
		setBillSelected(null)
		setCreditNoteSelected(null)
	}

	const filteredBills = receivedBills
		? receivedBills.map((bill) => ({
				...bill,
				clp: bill.currency === 'CLP' ? bill.amount : DolarToClp(bill.amount),
				usd: bill.currency === 'USD' ? bill.amount : ClpToDolar(bill.amount),
		  }))
		: null

	const bills = filteredBills
		? filteredBills.filter((bill) => bill.type === 'received')
		: null
	const creditNotes = filteredBills
		? filteredBills.filter(
				(bill) =>
					bill.type === 'credit_note' &&
					billSelected &&
					bill.reference === billSelected.id
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
							} ${
								billSelected && billSelected.id === bill.id
									? 'bg-indigo-100'
									: ''
							}`}
						>
							<div className="flex items-center">
								<input
									type="radio"
									name="selectedBill"
									checked={billSelected && billSelected.id === bill.id}
									onChange={() => handleBillSelected(bill)}
									className="form-radio mx-4"
								/>
								<p className="font-bold">{bill.id} </p>
								<p className="text-gray-400 ml-1">({bill.organization_id})</p>
							</div>
							<div className="flex">
								<p className="text-black-400">${bill.clp} CLP</p>
								<p className="text-gray-400 ml-1">${bill.usd} USD</p>
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
									} ${
										creditNoteSelected && creditNoteSelected.id === bill.id
											? 'bg-indigo-100'
											: ''
									}`}
								>
									<div className="flex items-center">
										<input
											type="radio"
											name="selectedCreditNote"
											checked={
												creditNoteSelected && creditNoteSelected.id === bill.id
											}
											onChange={() => handleCreditNoteSelected(bill)}
											className="form-radio mx-4"
										/>
										<p className="font-bold">{bill.id}</p>
										<p className="text-gray-400">({bill.organization_id})</p>
									</div>
									<div className="flex">
										<p className="text-black-400">${bill.clp} CLP</p>
										<p className="text-gray-400 ml-1">${bill.usd} USD</p>
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

			{billSelected && creditNoteSelected ? (
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
						text={
							<>
								<div className="flex  justify-between">
									<div className="flex flex-col">
										<p>-</p>
										<p className="font-bold">Nota de Crédito</p>
										<p className="font-bold">Factura</p>
									</div>
									<div className="flex flex-col">
										<p className="font-bold">Id</p>
										<p className="mx-4">{creditNoteSelected.id}</p>
										<p className="mx-4">{billSelected.id}</p>
									</div>
									<div className="flex flex-col">
										<p className="font-bold">CLP</p>
										<p>${creditNoteSelected.clp}</p>
										<p>${billSelected.clp}</p>
									</div>
									<div className="flex flex-col">
										<p className="font-bold">USD</p>
										<p>${creditNoteSelected.usd}</p>
										<p>${billSelected.usd}</p>
									</div>
								</div>
								<br />
								Monto de la Factura actualizada: $
								{billSelected.clp - creditNoteSelected.clp} CLP ($
								{billSelected.usd - creditNoteSelected.usd} USD)
								<br />
								Nota de crédito asignada correctamente
							</>
						}
						buttonText="Seguir asignando"
					/>
				</div>
			) : null}
		</div>
	)
}
