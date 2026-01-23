import { ThemeContext } from '@/context/ThemeProvider';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ExpenseStatsCardProps {
	todaySpent: number;
	weekAvg: number;
}

const ExpenseStatsCard: React.FC<ExpenseStatsCardProps> = ({ todaySpent, weekAvg }) => {
	const { colors } = useContext(ThemeContext);
	return (
		<View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }] }>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={[styles.label, { color: colors.text }]}>Vandaag uitgegeven</Text>
				<Text style={[styles.amount, { color: colors.primary }]}>€ {todaySpent.toFixed(2)}</Text>
			</View>
			<View style={[styles.divider, { backgroundColor: colors.border }]} />
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={[styles.label, { color: colors.text }]}>Weekgemiddelde</Text>
				<Text style={[styles.amount, { color: colors.primary }]}>€ {weekAvg.toFixed(2)}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		borderRadius: 14,
		padding: 18,
		marginVertical: 10,
		alignItems: 'center',
		justifyContent: 'center',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	label: {
		fontWeight: 'bold',
		fontSize: 15,
		textAlign: 'center',
	},
	amount: {
		fontSize: 22,
		fontWeight: 'bold',
		marginTop: 2,
		textAlign: 'center',
	},
	divider: {
		width: 1,
		marginHorizontal: 12,
		height: 40,
		alignSelf: 'center',
	},
});

export default ExpenseStatsCard;
