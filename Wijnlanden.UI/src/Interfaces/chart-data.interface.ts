export interface IChartData {
	name: string;
	value: number;
}

export interface IFoodData {
	categoryName: string;
	data: { [key: string]: number };
}
