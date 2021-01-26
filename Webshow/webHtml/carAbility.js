var carAbility =
{
    data:
    {
        'carA':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
        },
        'carB':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
        },
        'carC':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
        },
        'carD':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
        },
        'carE':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
        }
    },
    setData: function (inputData) {
        this.data[inputData.carIndexStr][inputData.pType].costValue = inputData.costValue;
        this.data[inputData.carIndexStr][inputData.pType].sumValue = inputData.sumValue;
    },
    drawPanel: function (carIndexStr) {
        var abilityCanvasContainer = document.createElement('div');
        abilityCanvasContainer.id = 'abilityCanvasContainer';
    }
};