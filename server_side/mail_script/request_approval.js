//Author Antone king
//request level approval with the ability to approve or deny individual items in one email message
//bulk approval ability with modified buttons

var baseURL = gs.getProperty("glide.servlet.uri");
var itemURL = "nav_to.do?uri=sc_req_item.do?sys_id=";
var req = new GlideRecord("sc_request");

if (req.get(current.sysapproval)){	
	var body = '';
	var itemInfo = '';
	var total = 0;
	//antone king update - order of variables
	template.print("<p>Requestor: " + req.requested_for.name+"</p>");
	template.print("<p>State: " + req.request_state+"</p>");
	//body = "<p>Requestor: " + req.requested_for.name+"</p>";
	//body += "<p>State: " + req.request_state+"</p>";
	body+="<hr/><br><p>*Click on the buttons below to approve or reject the complete order."+"</p>";
	//body+="<p>Description: " + req.description;
	var ritm = new GlideRecord("sc_req_item");
	ritm.addQuery("request",req.sys_id);
	ritm.query();
	template.print(getImages(req));
	while (ritm.next()){
		total += ritm.quantity * ritm.price;
		itemInfo = " - " +ritm.cat_item.name + " - " + "Qty: " + ritm.quantity + " Price(ea): " + "$" + ritm.price;
		//body += "<p><a href=" + baseURL + itemURL + ritm.sys_id + "> " + ritm.number + "</a>"+ itemInfo +"</p>";
		//body += "<p>" + "<b>" + ritm.number + "</b>" + itemInfo + "</p>";
		//antone king update to add ritm variables
		template.print("<hr/><br><b>Summary of Requested item:</b>" +  "<br>" ); 
		template.print("<p>" + ritm.number + ": " + ritm.quantity + " X " + itemInfo +  "</p>");
		template.print("<b>Options:</b>" + "<br>");
		for( var key in ritm.variables){
			var v = ritm.variables[key];
			if(v.getGlideObject().getQuestion().getLabel() != '' && v.getDisplayValue() != ''){
				//template.space(1);
				template.print(" " + v.getGlideObject().getQuestion().getLabel() + " - " + v.getDisplayValue() + "<br>"); 
			}
			
		}
	}	
	total = parseFloat(Math.round(total * 100) / 100).toFixed(2);
	body += getImages(req);
	body += "<b>Request Total Amount: " + "$" + total + "</b><br>";	
	template.print(body);
}
function getImages(req){
	var email_address = '';
	var email_prop = new GlideRecord("sys_email_account");
	email_prop.addQuery("name","ServiceNow SMTP");
	email_prop.query();
	while(email_prop.next()){
		email_address = email_prop.user_name;
	}
	var mail_to = "mailto:"+email_address + "?subject=re:"+ req.number + " - ";
	var body = "&body= "+email.watermark;
	var approvalURL = mail_to + "approve" + body;
	var rejectURL = mail_to + "reject" + body;
	

	//var approveSrc = baseURL + "/email_approve.gif";
	//var rejectSrc = baseURL + "/email_reject.gif";
	
	var approveSrc = baseURL;
	var rejectSrc = baseURL;
	
	/*var images = "<a href='"+approvalURL+"' <img src= "+ approveSrc +" alt= 'Approve' width='140' height='47'/></a>";
	images +="<a href='"+rejectURL+"' <img src= "+ rejectSrc +" alt= 'Reject' width='140' height='47'/></a><br>";
	images += "<p><a href='"+approvalURL+"'> Approve </a>"+"  ||  "+" <a href='"+rejectURL+"'>Reject</a></p>";*/
	
	var images = "<p><a href='"+approvalURL+"'> Approve </a> "+"  ||  "+" <a href='"+rejectURL+"'>Reject</a></p>";
	return images;
}





