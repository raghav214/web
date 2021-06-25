var count =0
var states ="https://cdn-api.co-vin.in/api/v2/admin/location/states"
var district ="https://cdn-api.co-vin.in/api/v2/admin/location/districts/"
var sdate =formatDate(new Date());
var sage=18;
var feeT='Free';
var sid=363;
var stateId=21;
var retry = 30000;
var sent=[]
//milliseconds
$(document).ready(function() {
 var cd = new Date();
 var s = '';
   for (var i = -2; i < 20; i++) {
        var result = new Date();
        result.setDate(result.getDate() + i);
        var fd = formatDate(result);
        s += '<option value="' + fd + '">' + fd + '</option>';
      }
  $("#dateDropdown").html(s);


loadStates();
loadDistrict(stateId,sid);

 $("#departmentsDropdown").change(function(){
        sent=[]
        var deptid = $(this).val();
         loadDistrict(deptid,null);
});


 $("#desctDropdown").change(function(){
    sent=[]
    sid =$(this).val();
    table.ajax.url("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+sid+"&date="+sdate);
    table.ajax.reload(null, false);
 });

 $("#dateDropdown").change(function(){
      sent=[]
      sdate = $(this).val();
      table.ajax.url("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+sid+"&date="+sdate);
      table.ajax.reload(null, false);
 });

 $("#feeType").change(function(){
      feeT = $(this).val();
      table.ajax.url("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+sid+"&date="+sdate);
      table.ajax.reload(null, false);
 });

  $("#ageDropdown").change(function(){
       sage = $(this).val();
       table.ajax.url("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+sid+"&date="+sdate);
       table.ajax.reload(null, false);
  });

  var table = $('#example').DataTable( {
         ajax: {
             url:"https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+sid+"&date="+sdate,
             type:"GET",
             cache:false,
             dataSrc : function(op) {
                         var temp, item, data = [];
                         document.getElementById("div1").innerHTML = "<p> Auto Refresh Count: " + count + "</p>";
                         var found =false;
                         var foundName =''
                           var ik=1;
                           var ij=0;

                          for (s in  op.sessions){
                          item = {};
                                                       var avail = op.sessions[s].available_capacity;
                                                       var age = op.sessions[s].min_age_limit;
                                                       var name = op.sessions[s].name + '\n'+ op.sessions[s].address;
                                                       var fee = op.sessions[s].fee_type;
                                                       var day = op.sessions[s].date;
                                                       var vac = op.sessions[s].vaccine;
                                                       var pin = op.sessions[s].pincode
                                                       var dose1= op.sessions[s].available_capacity_dose1
                                                       var dose2= op.sessions[s].available_capacity_dose2

                                                       item['name'] = name ;
                                                       item['avail'] = avail;
                                                       item['age'] = age+' (D-1='+dose1+',D-2='+dose2+')';
                                                       item['day']= day;
                                                       item['vac']=vac;
                                                       item['fee']=fee;
                                                       item['pin']=pin;
                                                       if(age == sage && fee == feeT){
                                                       item['sno']=ik;
                                                         data.push(item);
                                                         ik++;
                                                           if(avail > 0 && !sent.includes(op.sessions[s].name)){
                                                                 found =true;
                                                                 ij++;
                                                                 if(ij <=4){
                                                                 foundName += op.sessions[s].name+' (D-1='+dose1+',D-2='+dose2+')'+'\n';
                                                                 }
                                                                 sent.push(op.sessions[s].name);
                                                               }
                                                           }
                          }



                              if(found){
                              new Notification("Available At:", {body: foundName});
                              }
                         return data
                     }
         },
         deferRender: true,
         columns: [
              { data: 'sno'},
             { data: 'name',"width": "30%" },
             { data: 'vac' },
             { data: 'avail' },
             { data: 'age' },
             { data: 'day' },
             { data: 'fee' },
             {data :'pin'}

         ],
         "aaSorting": [
               [2, "desc"]
             ],
             'rowCallback': function(row, data, index){
                 if(data.avail> 0){
                     $(row).find('td:eq(1)').css('font-weight', 'bold');
                 }

               },
         rowId: 'extn',
         select: true,
         dom: 'Bfrtip',
         paging: false,
         buttons: [
             {
                 text: 'Reload table',
                 action: function () {
                     table.ajax.reload();
                 }
             }
         ]

     } );



    $("#test").on("click",function(){
    setInterval (function (){
                count = count+1;
                table.ajax.url("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+sid+"&date="+sdate);
                table.ajax.reload(null, false);
            },retry);
    });
} );



		/* JS comes here */
askForApproval();

function askForApproval() {
   if(Notification.permission === "granted") {
    }
     else {
      Notification.requestPermission();
      }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

function loadStates(){
 $.ajax({
           type: "GET",
           url: states,
           success: function (resp) {
               var s = '';
               var data=resp.states;
               for (var i = 0; i < data.length; i++) {

                  s += '<option value="' + data[i].state_id + '">' + data[i].state_name + '</option>';

               }
               $("#departmentsDropdown").html(s);

               $("#departmentsDropdown").val('21');

           }
       });
}


function loadDistrict(id,deflt){
$.ajax({
                   type: "GET",
                   url: district+id,
                   success: function (resp) {
                       var s = '';
                       var data=resp.districts;
                       for (var i = 0; i < data.length; i++) {
                           s += '<option value="' + data[i].district_id + '">' + data[i].district_name + '</option>';
                       }
                       $("#desctDropdown").html(s);
                       if(deflt != null){
                             $("#desctDropdown").val(deflt);

                       }
                   }
               });

}