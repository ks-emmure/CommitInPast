var rep = 'https://github.com/psixodyb/testFakeCommit.git';
/**
 * [exec For commands in cmd]
 * @type {[function]}
 */
var exec = require('child_process').exec,
    /**
     * [DateCommand temp date command in cmd]
     * @type {String}
     */
    DateCommand = "D:\\Git\\bin\\date.exe",
    /**
     * [timeInMs all time in ms]
     * @type {Object}
     */
    timeInMs = {
        'sec': 1000,
        'min': 1000*60,
        'hour': 1000*60*60,
        'day': 1000*60*60*24
    };
    var beginTime = Date.now();
    var startCycle = Date.now()-timeInMs.day*365,
        DateForCycle = new Date();

    DateForCycle.setTime(startCycle);

    /**
     * [getDateString get object and return string for command in cmd format = +%Y%m%d]
     * @param  {[object]} dateObj [date object]
    */
    function getDateString(dateObj) {
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth()+1;
        var day = dateObj.getDate();
        var time = getZero(dateObj.getHours())+':'+getZero(dateObj.getMinutes())+':'+getZero(dateObj.getSeconds());

        function getZero(number) {
            if(number < 10) {
                return '0'+number;
            } else {
                return ''+number;
            }
        }

        return year+'-'+getZero(month)+'-'+getZero(day)+' '+time;
    }


    /**
     * [commit make fake commit]
     * @param  {Function} callback [callback after commit]
     */
    function commit(callback) {


        exec('echo 1 >> file.txt && git add file.txt && git commit -m "'+getDateString(DateForCycle)+'"', function(error, stdout, stderr) {

            callback();
        });
    }

    /**
     * [setDate setDate on PC]
     * @param {[object]}   date     [date what need to set]
     * @param {Function} callback [callback after set date]
     */
    function setDate(date, callback) {
        exec(DateCommand + ' +%Y-%m-%d_%T -s "'+getDateString(DateForCycle)+'"', function(error, stdout, stderr) {
            callback();
        });
    }


    /**
     * [start]
     */
    function start(){
        
        
        loop();
        var bigDay = true;
        /**
         * [loop one day  loop for commits]
         */
        function loop() {
            if( DateForCycle.getTime() < beginTime ) {

                
                bigDay ^= true;
                setDate(DateForCycle, function(){
                    commit(function() {
                        if(bigDay) {
                            commit(setNextDay);
                        } else {
                            setNextDay();

                        }
                    })
                });
            } else {
                exec('git remote add origin '+rep+' &&  git push -u origin master -f', function(){
                    });

            }
        }

        function setNextDay() {
            DateForCycle.setDate(DateForCycle.getDate()+1);
            loop();
        }
    }

    exec('rm -rf *.txt && rm -rf .git && git init', start);

