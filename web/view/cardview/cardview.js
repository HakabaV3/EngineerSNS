var View = require('../view/view.js'),
    util = require('../../service/util.js');

function CardView() {
    View.apply(this, arguments);
}
util.inherits(CardView, View);

CardView.setViewConstructor('CardView');

module.exports = CardView;
