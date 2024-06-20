import { useQuery } from '@tanstack/react-query'

export const useReceivedBills = () => {
	return useQuery({
		queryKey: ['receivedBills'],
		queryFn: async () => {
			const response = await fetch(
				'https://recruiting.api.bemmbo.com/invoices/pending'
			)
			if (!response.ok) {
				console.log(response)
				throw new Error('Network response was not ok')
			}
			return await response.json()
		},
	})
}
