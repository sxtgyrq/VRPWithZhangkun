var carAbility =
{
    data:
    {
        'carA':
        {
            'mile': { 'costValue': 120, 'sumValue': 350 },
            'business': { 'costValue': 110, 'sumValue': 120 },
            'volume': { 'costValue': 190, 'sumValue': 300 },
            'speed': { 'costValue': 0, 'sumValue': 1 }
        },
        'carB':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
            'speed': { 'costValue': 0, 'sumValue': 1 }
        },
        'carC':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
            'speed': { 'costValue': 0, 'sumValue': 1 }
        },
        'carD':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
            'speed': { 'costValue': 0, 'sumValue': 1 }
        },
        'carE':
        {
            'mile': { 'costValue': 0, 'sumValue': 1 },
            'business': { 'costValue': 0, 'sumValue': 1 },
            'volume': { 'costValue': 0, 'sumValue': 1 },
            'speed': { 'costValue': 0, 'sumValue': 1 }
        }
    },
    setData: function (inputData) {
        this.data[inputData.carIndexStr][inputData.pType].costValue = inputData.costValue;
        this.data[inputData.carIndexStr][inputData.pType].sumValue = inputData.sumValue;
    },
    drawPanel: function (carIndexStr) {
        this.clear();

        var abilityCanvasContainer = document.createElement('div');
        abilityCanvasContainer.id = 'abilityCanvasContainer';

        var canvasObj = document.createElement('canvas');
        canvasObj.id = 'chanleOfCarAbility';
        canvasObj.height = 60;
        canvasObj.width = 140;

        abilityCanvasContainer.appendChild(canvasObj);

        {
            var TextOfCarAbility = document.createElement('div');
            TextOfCarAbility.id = 'TextOfCarAbility';

            var divMile = document.createElement('div');
            divMile.innerText = '' + this.data[carIndexStr].mile.costValue + '/' + this.data[carIndexStr].mile.sumValue;;
            divMile.id = carIndexStr + '_' + 'mile' + '_' + 'display';
            divMile.className = 'TextOfCarAbilityItem';

            var divBusiness = document.createElement('div');
            divBusiness.innerText = '' + this.data[carIndexStr].business.costValue + '/' + this.data[carIndexStr].business.sumValue;;
            divBusiness.id = carIndexStr + '_' + 'business' + '_' + 'display';
            divBusiness.className = 'TextOfCarAbilityItem';

            var divVolume = document.createElement('div');
            divVolume.innerText = '' + this.data[carIndexStr].volume.costValue + '/' + this.data[carIndexStr].volume.sumValue;;
            divVolume.id = carIndexStr + '_' + 'volume' + '_' + 'display';
            divVolume.className = 'TextOfCarAbilityItem';

            TextOfCarAbility.appendChild(divMile);
            TextOfCarAbility.appendChild(divBusiness);
            TextOfCarAbility.appendChild(divVolume);

            abilityCanvasContainer.appendChild(TextOfCarAbility);
        }

        {
            var divOfSpeed = document.createElement('div');
            divOfSpeed.classList.add('speedValueContainer');
            var spanOfSpeedValue = document.createElement('span');
            spanOfSpeedValue.innerText = this.data[carIndexStr].speed.costValue;
            spanOfSpeedValue.id = carIndexStr + '_' + 'spanOfSpeedValue';

            divOfSpeed.appendChild(spanOfSpeedValue);
            abilityCanvasContainer.appendChild(divOfSpeed);
        }

        document.body.appendChild(abilityCanvasContainer);

        this.drawChanel(carIndexStr);
    },
    drawChanel: function (carIndexStr) {
        var c = document.getElementById("chanleOfCarAbility");
        if (c == null) {
            return;
        }
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#800000";
        ctx.fillRect(0, 0, 140, 20);
        ctx.fillStyle = "#FF0000";
        var percentMile = this.data[carIndexStr].mile.costValue / this.data[carIndexStr].mile.sumValue;
        percentMile = Math.min(1, percentMile);
        ctx.fillRect(0, 0, percentMile * 140, 20);

        ctx.fillStyle = "#008000";
        ctx.fillRect(0, 20, 140, 40);
        ctx.fillStyle = "#00FF00";
        var percentBusiness = this.data[carIndexStr].business.costValue / this.data[carIndexStr].business.sumValue;
        percentBusiness = Math.min(1, percentBusiness);
        ctx.fillRect(0, 20, 140 * percentBusiness, 40);

        ctx.fillStyle = "#000080";
        ctx.fillRect(0, 40, 140, 60);
        ctx.fillStyle = "#0000FF";
        var percentVolume = this.data[carIndexStr].volume.costValue / this.data[carIndexStr].volume.sumValue;
        percentVolume = Math.min(1, percentVolume);
        ctx.fillRect(0, 40, 140 * percentVolume, 60);
        {
            var id = carIndexStr + '_' + 'mile' + '_' + 'display';
            if (document.getElementById(id) != null)
                document.getElementById(id).innerText = '' + this.data[carIndexStr].mile.costValue + '/' + this.data[carIndexStr].mile.sumValue;;
        }
        {
            var id = carIndexStr + '_' + 'business' + '_' + 'display';
            if (document.getElementById(id) != null)
                document.getElementById(id).innerText = '' + this.data[carIndexStr].business.costValue + '/' + this.data[carIndexStr].business.sumValue;;
        }
        {
            var id = carIndexStr + '_' + 'volume' + '_' + 'display';
            if (document.getElementById(id) != null)
                document.getElementById(id).innerText = '' + this.data[carIndexStr].volume.costValue + '/' + this.data[carIndexStr].volume.sumValue;;
        }
        {
            var id = carIndexStr + '_' + 'spanOfSpeedValue';
            if (document.getElementById(id) != null)
                document.getElementById(id).innerText = '' + this.data[carIndexStr].speed.costValue;
        }
    },
    clear: function () {
        if (document.getElementById('abilityCanvasContainer') != null) {
            document.getElementById('abilityCanvasContainer').remove();
        }
    }
};