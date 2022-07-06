export class Food {
	static getCanapes() {
		const canapes: { [key: string]: string } = {};
		canapes['Option1'] = `Mini Vetkoekies filled with Camembert Cheese & Green Figs;
        Bruschetta topped with Roast BBQ Chicken, Chili Mayo, Rocket & Burnt Onion;
        Bruschetta topped with Pulled Pork Shoulder, Mustard, Feta & Rocket
        `;
		canapes['Option2'] = `Bruschetta topped with Sweet Chili Prawns;
        Cape Malay Beef Samoosas;
        Mini Vetkoekies with Balsamic Cream Cheese, Rocket & Ostrich Carpaccio;
        Cheese Platter with Fruit & Biscuits
        `;
		canapes['Option3'] = `Mini Burgers;
        Cranberry and Brie Puff pastry bites;
        Crumbed Prawns served with Sweet Chili Mayo;
        Bruschetta topped with Italian Salami, Cream Cheese & Rocket
        `;
		canapes['Option4'] = `Selection of Homemade Breads & Vetkoekies;
        Pâté’s;
        Preserves;
        Local Cheeses with Green Figs & Fresh Fruit;
        Boerewors Bites;
        Cold Meats;
        Mini Beef Samoosas and/or Springrolls
        `;
		canapes['Option5'] = `Selection of Homemade Breads & Vetkoekies;
        Pâté’s;
        Preserves;
        Local Cheeses with Green Figs & Fresh Fruit;
        Soup;
        <i><small>( French Onion Soup / Creamy Pumpkin & Sweet Potato Soup / Tomato Soup /</small></i>;
        <i><small>Thick Vegetable Soup / Biltong & Mushroom Soup / Creamy Mushroom Soup )</small></i>;
        `;
		return canapes;
	}

	static getMains() {
		const mains: { [key: string]: string } = {};
		mains['LambAndGravy'] = `Roasted Leg of Lamb with Gravy`;
		mains['LambPies'] = `Individual Lamb Pies`;
		mains['MuttonCurry'] = `Cape Malay Mutton Curry`;
		mains['RoastedBeef'] = `Roasted Beef with Red Wine & Garlic Jus`;
		mains['BeefStroganoff'] = `Beef Stroganoff`;
		mains['Bobotie'] = `Traditional Bobotie`;
		mains['BeefLasagne'] = `Beef Lasagne`;
		mains['OxtailPotjie'] = `Oxtail Potjie`;
		mains['ChickenSchnitzelPepper'] = `Chicken Schnitzel served in a Peppery Mushroom & Sherry Sauce`;
		mains['RoastedChicken'] = `Roasted Chicken`;
		mains['ButterChicken'] = `Butter Chicken`;
		mains['ChickenPies'] = `Individual Chicken Pies`;
		mains['ChickenAndPrawnCurry'] = `Tikka Chicken & Prawn Curry`;
		mains['StuffedChickenFillet'] = `Chicken Fillet stuffed with Spinach, Peppadew & Mozzarella wrapped in Bacon`;
		mains[
			'ChickenSchnitzelPeppadew'
		] = `Chicken Schnitzel <i>(Crumbed or Grilled)</i> served with Mushroom & Cheddar Sauce`;
		mains['CordonBleu'] = `Chicken Cordon Bleu served with 3 Cheeses Sauce`;
		mains['ChickenPasta'] = `Chicken, Mushrooms & Peppers in a Creamy Brandy Sauce served on Penne Pasta`;
		mains['Gammon'] = `Gammon served with Homemade Mustard Sauce`;
		mains['PorkNeck'] = `Roasted Pork Neck served with Port & Mango Sauce`;
		mains['PorkLeg'] = `Roasted Leg of Pork served with Honey Infused Gravy`;
		mains['SweetChiliPrawns'] = `Sweet Chili & Garlic Prawns`;
		mains['LineFish'] = `Fried Line Fish served with Tartare Sauce`;
		return mains;
	}

	static getSides() {
		const sides: { [key: string]: string } = {};
		sides['BabyPotatoes'] = `Roasted Baby Potatoes`;
		sides['PotatoWedges'] = `Roasted Potato Wedges`;
		sides['PotatoBake'] = `Creamy Potato Bake with Bacon, Peppers & Sour Cream`;
		sides['Mash'] = `Peppered Potato Mash with lots of Butter`;
		sides['SauteedPotatoes'] = `Sautéed Potatoes`;
		sides['SpicedRice'] = `Spiced Rice`;
		sides['RiceAndRaisins'] = `Yellow Rice with Raisins`;
		sides['BrownRice'] = `Brown Rice`;
		sides['CaramelizedPumpkin'] = `Caramelized Pumpkin with Honey & Almonds`;
		sides['RoastedButternut'] = `Roasted Butternut`;
		sides['PumpkinFritters'] = `Cinnamon Sugar Pumpkin Fritters`;
		sides['Medley'] = `Medley of Roasted Pumpkin & Sweet Potato with Cinnamon Sticks & Butter`;
		sides['SweetPotato'] = `Old Fashioned Sweet Potato <i>(plain or ginger or orange infused)</i>`;
		sides['SweetPotatoWheels'] = `Sweet Potato Pastry Wheels`;
		sides['PumpkinTart'] = `Pumpkin Tart with Cinnamon`;
		sides['CauliflowerAndBroccoli'] = `Cauliflower & Broccoli served with Cheese Sauce`;
		sides['RoastedVegetables'] = `Roasted Garden Vegetable`;
		sides['StirfriedVegetables'] = `Stir-fried Julienne Vegetables`;
		sides['CarrotsAndPeas'] = `Baby Carrots & Garden Peas`;
		sides['GreenBeansAndLinguiniPasta'] = `Green Beans, Garlic & Basil Pesto Linguini Pasta`;
		sides['GreenBeansBaconOnionsTomatoes'] = `Green Beans with Bacon, Baby Onions & Cocktail Tomatoes`;
		sides['SpinachAndMushrooms'] = `Creamed Spinach & Mushrooms`;
		sides['GreekSalad'] = `Greek Salad`;
		sides['GardenSalad'] = `Garden Salad`;
		sides['BeetrootAndButternutSalad'] = `Roasted Beetroot- & Butternut Salad with Rocket, Feta & Nuts`;
		sides['RocketPawpawFetaPeanutBrittleSalad'] = `Rocket, Paw paw, Feta & Peanut Brittle Salad`;
		sides['ButternutSweetPotatoSalad'] = `Butternut & Sweet Potato Salad with Crispy Bacon & Rocket`;
		sides['Coleslaw'] = `Tangy Coleslaw with Baby Marrow`;
		sides['MediterraneanPasta'] = `Mediterranean Pasta or Pasta Rice Salad`;
		sides['BabyPotatoBaconSalad'] = `Baby Potato & Bacon Salad`;
		sides['BeanSalad'] = `3 Bean Salad`;
		return sides;
	}

	static getDesserts() {
		const deserts: { [key: string]: string } = {};
		deserts['Cheesecake'] = `Lemon Meringue Cheesecake`;
		deserts['Pavlova'] = `Fresh Fruit & Caramel Cream Pavlova`;
		deserts['Malvapudding'] = `Malvapudding served with Brandy Custard, Cream & Berries`;
		deserts['MousseIceCream'] = `Chocolate Mousse served with Vanilla Ice Cream`;
		deserts['Brownie'] = `Chocolate Brownie served with Cream / Vanilla Ice Cream & Nuts`;
		deserts['LemonMeringueIceCream'] = `Lemon Meringue tartlets served with Vanilla Ice Cream`;
		deserts['ChocolatePudding'] = `Chocolate Pudding served with Cream / Vanilla Ice Cream / Caramel Custard`;
		deserts['PeppermintCrisp'] = `Peppermint Crisp tartlet served with Cream / Vanilla Ice Cream`;
		deserts['ChocolatePancakes'] = `Chocolate Pancakes filled with Chocolate Mousse served with Cream / Ice Cream`;
		deserts['Waffles'] = `Waffles with Strawberry & Vanilla Ice Cream`;
		deserts['Sago'] = `Traditional Sago Pudding served with Apricot Preserve & Italian Meringue`;
		deserts['AppleAlmondPie'] = `Apple & Almond Pie served with Caramel Cream`;
		deserts['Eclairs'] = `French Lemon Eclairs`;
		return deserts;
	}
}
