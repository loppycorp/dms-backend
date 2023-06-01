const lang = require('../helpers/lang.helper');

const decodeURI = (p = '') => {
    if (p.match('%23')) p = p.replace('%23', '#');
    if (p.match('%26')) p = p.replace('%26', '&');

    return p;
}

const includePath = (url) => {
    const paths = [
        'commission-formulas'
    ];

    return paths.some(p => url.match(new RegExp(p, "g")));
}

exports.setAttributes = async (req, res, next) => {
    const action = req.path.split('/').slice(-1)[0];
    const custPageLimits = { 
        'contract-orders': 10, 
        'order-status': 10, 
        'comments': 10,
        'contract-order-activations': 10,
    };

    let pageNum = 1;
    let pageLimit = 10;
    let sortOrder = 'desc';
    let sortOrderInt = -1;
    let sortBy = '_id';
    let showAll = 'false';

    const queryPageNum = req.query.page_num;
    const queryPageLimit = req.query.page_limit;
    const querySortOrder = req.query.sort_order;
    const querysortBy = req.query.sort_by;
    const queryShowAll = req.query.show_all;
    const queryKeyword = req.query.keyword;

    const pagiNumMin = 1;
    const pageLimitMin = custPageLimits[action] ? custPageLimits[action] : 5;

    if (req.query.keyword)
        req.query.keyword = decodeURI(queryKeyword);

    if (typeof queryPageNum != 'undefined' && queryPageNum != '') {
        pageNum = parseInt(queryPageNum);
    }

    if (typeof queryPageLimit != 'undefined' && queryPageLimit != '') {
        pageLimit = parseInt(queryPageLimit);
    }

    if (typeof querySortOrder != 'undefined' && querySortOrder == 'asc') {
        sortOrderInt = 1;
        sortOrder = 'asc';
    }

    if (typeof querySortOrder != 'undefined' && querySortOrder == 'desc') {
        sortOrderInt = -1;
        sortOrder = 'desc';
    }

    if (typeof querysortBy != 'undefined' && querysortBy != '') {
        sortBy = querysortBy.toString().trim()
    }

    if (typeof queryShowAll != 'undefined' && queryShowAll == 'true') {
        showAll = queryShowAll;
    }

    req.query.pagination = {
        pageNum,
        pageLimit,
        sortOrder,
        sortBy,
        sortOrderInt,
        showAll
    };

    next();
};