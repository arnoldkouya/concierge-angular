<!-- When a session timeout occurs, shiro will redirect request web application login.jsp. This code will redirect to system login page -->

<%
    String redirectURL = "/logout.jsp";
    response.sendRedirect(redirectURL);
%>