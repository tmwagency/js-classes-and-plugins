<!DOCTYPE html>

<html>
    <head>
        <title>Facebook App Example</title>
    </head>
    
    <body>
        <!-- =======================================================
                FACEBOOK ROOT ELEMENT - This is required!
             ======================================================= -->
            <div id="fb-root"></div>
        <!-- ======================================================= -->
        
        <button id="loginButton">Login to Facebook</button>
        <button id="uiPostButton">Post With UI</button>
        <button id="apiPostButton">Post With API</button>
        
        
        
        <!-- =======================================================
                Signals event messaging system - This is required!
             ======================================================= -->
            <script type="text/javascript" src="js/libs/signals.min.js"></script>
        <!-- ======================================================= -->
        
        <!-- =======================================================
                jQuery is currently only being used for
                $(document).ready, and so is required unless this
                method is removed.
             ======================================================= -->
             <script type="text/javascript" src="js/libs/jquery.min.js"></script>
        <!-- ======================================================= -->
            
        <!-- =======================================================
                Facebook class being demonstrated- This is required (obviously)!
             ======================================================= -->
            <script type="text/javascript" src="js/libs/Facebook.js"></script>
        <!-- ======================================================= -->
            
            <script type="text/javascript" src="js/App.js"></script>
            <script type="text/javascript" src="js/Main.js"></script>
    </body>
</html>