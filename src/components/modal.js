import React from 'react'

export default function Modal({ isOpen, onClose, text }) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
			<div className="relative w-auto max-w-3xl mx-auto my-6">
				<div className="fixed inset-0 bg-gray-900 opacity-50"></div>
				<div className="relative flex flex-col bg-white shadow-md rounded-lg outline-none focus:outline-none p-5 items-center">
					<h3 className="text-xl font-semibold">{text}</h3>
					<button
						className="m-1 p-2 border-0 w-fit bg-indigo-500 text-white float-right text-lg leading-none font-semibold outline-none focus:outline-none"
						onClick={onClose}
					>
						Seguir asignando
					</button>
				</div>
			</div>
		</div>
	)
}
