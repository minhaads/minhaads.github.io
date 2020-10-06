router.get('/dashboard', admAuth, (req,res) => {
    let month = res.locals.ctMonth;
    let year = res.locals.ctYear;

    let valueClickFindUser;
    let earningsAllUser;
    let valueClickFindAdm;
    let earningsAllAdm;
    let earningsRefAll;
    let monthClicks;
    let monthEarnings;
    let monthEarningsRefAll;
    let monthEarningsTu;
    let monthClicksAdm;
    let monthEarningsAdm;
    let averageClicksAdm;
    let dayClicks;
    let clicksDay;
    let clicksCount;
    let dayClicksAll = [];
    let clicksDayAll = [];
    let dayClicksadm;
    let clicksDayadm;
    let clicksCountadm;
    let dayClicksAlladm = [];
    let clicksDayAlladm = [];

    Click.findAndCountAll({
        where: {
            [Op.and]: [
                { month: month },
                { year: year }
            ]
        }
    }).then(clicks => {

        Click.findAndCountAll({
            where:{
                [Op.and]: [
                    {property: 'user'},
                    { month: month },
                    { year: year }
                ]
            }
        }).then(clicksusers => {

            Click.findAndCountAll({
                where:{
                    [Op.and]: [
                        {property: 'adm'},
                        { month: month },
                        { year: year }
                    ]
                }
            }).then(clicksadm => {


                if (clicks.count != 0) {

                    for (let x of clicks.rows) {
        
                        if (x.property == 'user') {
        
                            if (valueClickFindUser != undefined) {
                                valueClickFindUser = valueClickFindUser + 1;
                                earningsAllUser = parseFloat(earningsAllUser) + parseFloat(x.earningsclicks);
                                earningsRefAll = parseFloat(earningsRefAll) + parseFloat(x.clickearningsref);
                            } else {
                                valueClickFindUser = 1;
                                earningsAllUser = parseFloat(x.earningsclicks);
                                earningsRefAll = parseFloat(x.clickearningsref);
                            }
                            
                        } else {
                            if (valueClickFindAdm != undefined) {
                                valueClickFindAdm = valueClickFindAdm + 1;
                                earningsAllAdm = parseFloat(earningsAllAdm) + parseFloat(x.earningsclicks);
                            } else {
                                valueClickFindAdm = 1;
                                earningsAllAdm = parseFloat(x.earningsclicks);
                            }
                        }
                    }
                    
                    monthClicks = valueClickFindUser;
                    monthEarnings = (parseFloat(earningsAllUser)).toFixed(2);
                    monthEarningsRefAll = (parseFloat(earningsRefAll)).toFixed(2);
                    monthEarningsTu = (parseFloat(earningsAllUser) + parseFloat(earningsRefAll)).toFixed(2);
                    monthClicksAdm = valueClickFindAdm;
                    monthEarningsAdm = (parseFloat(earningsAllAdm)).toFixed(2);
                    averageClicksAdm =  (parseFloat(earningsAllAdm) / monthClicksAdm).toFixed(3);

                } else {
                    monthClicks = 0;
                    monthEarnings = '0.00';
                    monthEarningsRefAll = '0.00';
                    monthEarningsTu = '0.00';
                    monthClicksAdm = 0;
                    monthEarningsAdm = '0.00';
                    averageClicksAdm =  '0.000';
                }

                ///////////////////////////////////

                if (clicksusers.count != 0) {


                    for (let x of clicksusers.rows) {
                        
                        if (dayClicks != undefined) {
                            if (dayClicks != x.day) {
                                dayClicksAll.push({dateDay : ((x.day).toString() + '/' + (month).toString()).toString()});
                                dayClicks = x.day;
                                clicksDayAll.push(clicksDay);
                                clicksDay = 1;
                                clicksCount = clicksCount + 1;
                            } else {
                                clicksDay = clicksDay + 1;
                                clicksCount = clicksCount + 1;
                            }
                        } else {
                            dayClicksAll.push({dateDay : ((x.day).toString() + '/' + (month).toString()).toString()});
                            dayClicks = x.day;
                            clicksDay = 1;
                            clicksCount = 1;
                        }
    
                        if (clicksCount == clicksusers.count) {
                            clicksDayAll.push(clicksDay);
                        }
                    }
    
                    
                } else {
                    dayClicksAll = [{dateDay: ''}];
                    clicksDayAll = 0;
                }


                ///////////////////////////////////

                if (clicksadm.count != 0) {

    
                    for (let x of clicksadm.rows) {
                        
                        if (dayClicksadm != undefined) {
                            if (dayClicksadm != x.day) {
                                dayClicksAlladm.push({dateDay : ((x.day).toString() + '/' + (month).toString()).toString()});
                                dayClicksadm = x.day;
                                clicksDayAlladm.push(clicksDayadm);
                                clicksDayadm = 1;
                                clicksCountadm = clicksCountadm + 1;
                            } else {
                                clicksDayadm = clicksDayadm + 1;
                                clicksCountadm = clicksCountadm + 1;
                            }
                        } else {
                            dayClicksAlladm.push({dateDay : ((x.day).toString() + '/' + (month).toString()).toString()});
                            dayClicksadm = x.day;
                            clicksDayadm = 1;
                            clicksCountadm = 1;
                        }
    
                        if (clicksCountadm == clicksadm.count) {
                            clicksDayAlladm.push(clicksDayadm);
                        }
                    }
                } else {
                    monthClicksAdm = 0;
                    monthEarningsAdm = '0.00';
                    averageClicksAdm =  '0.000';
                    dayClicksAlladm = [{dateDay: ''}];
                    clicksDayAlladm = 0;
                }

                res.render('admin/index', {monthClicks: monthClicks, monthEarnings: monthEarnings, monthEarningsRefAll: monthEarningsRefAll, monthEarningsTu: monthEarningsTu, monthClicksAdm: monthClicksAdm, monthEarningsAdm: monthEarningsAdm, averageClicksAdm: averageClicksAdm, dayClicksAll: dayClicksAll, clicksDayAll: clicksDayAll, dayClicksAlladm: dayClicksAlladm, clicksDayAlladm: clicksDayAlladm});

            }).catch((err) => {
                req.flash('msgError', 'Houve o seguinte erro interno: ', err);
                res.redirect('/dashboard');
            });
            
        }).catch((err) => {
            req.flash('msgError', 'Houve o seguinte erro interno: ', err);
            res.redirect('/dashboard');
        });
        
    }).catch((err) => {
        req.flash('msgError', 'Houve o seguinte erro interno: ', err);
        res.redirect('/dashboard');
    });
});
