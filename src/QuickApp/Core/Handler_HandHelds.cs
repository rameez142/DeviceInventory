using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using MOI.Patrol;
namespace Core
{
    class Handler_HandHelds
    {
        private patrolsContext _context = new patrolsContext();
        private Handler_User _user = new Handler_User();


        //all functions here require Ahwal Permssion
        //public static OperationLog Add_HandHeldr(User u, HandHeld h)//this transaction requires User_Role_Maintenance Permisson on this AhwalID
        //{
        //    try
        //    {
        //        //first we have to check if this user is authorized to perform this transaction
        //        if (!Core.Handler_User.isAuthorized(u.UserID, h.AhwalID, Handler_User.User_Role_Maintenance))
        //        {
        //            OperationLog ol_failed = new OperationLog();
        //            ol_failed.UserID = u.UserID; 
        //            ol_failed.OperationID = Handler_Operations.Opeartion_AddHandHeld;
        //            ol_failed.StatusID = Handler_Operations.Opeartion_Status_UnAuthorized;
        //            ol_failed.Text = "المستخدم لايملك صلاحية هذه العمليه";
        //            Handler_Operations.Add_New_Operation_Log(ol_failed);
        //            return ol_failed;
        //        }
        //        //next we need to search if there is a handheld with same serial
        //        DataClassesDataContext db = new DataClassesDataContext(Handler_Global.connectString);
        //        HandHeld HandHeld_exists = db.HandHelds.FirstOrDefault(e => e.Serial.Equals(h.Serial));
        //        if (HandHeld_exists != null)
        //        {
        //            OperationLog ol_failed = new OperationLog();
        //            ol_failed.UserID = u.UserID; 
        //            ol_failed.OperationID = Handler_Operations.Opeartion_AddHandHeld;
        //            ol_failed.StatusID = Handler_Operations.Opeartion_Status_Failed;
        //            ol_failed.Text = "يوجد لاسلكي بنفس رقم : " + h.Serial;
        //            Handler_Operations.Add_New_Operation_Log(ol_failed);
        //            return ol_failed;
        //        }
        //        h.BarCode = "HAN" + h.Serial;
        //        db.HandHelds.InsertOnSubmit(h);
        //        db.SubmitChanges();

        //    }
        //    catch (Exception ex)
        //    {
        //        OperationLog ol_failed = new OperationLog();
        //        ol_failed.UserID = u.UserID; 
        //        ol_failed.OperationID = Handler_Operations.Opeartion_AddHandHeld;
        //        ol_failed.StatusID = Handler_Operations.Opeartion_Status_UnKnownError;
        //        ol_failed.Text = ex.Message;
        //        Handler_Operations.Add_New_Operation_Log(ol_failed);
        //        return ol_failed;
        //    }
        //    OperationLog ol = new OperationLog();
        //    ol.UserID = u.UserID;
        //    ol.OperationID = Handler_Operations.Opeartion_AddHandHeld;
        //    ol.StatusID = Handler_Operations.Opeartion_Status_Success;
        //    ol.Text = "تم اضافة لاسلكي: " + h.Serial;
        //    Handler_Operations.Add_New_Operation_Log(ol);
        //    return ol;
        //}
        //public static OperationLog Update_HandHeld(User u, HandHeld h)//this transaction requires User_Role_Maintenance Permisson on this AhwalID
        //{
        //    try
        //    {
        //        //first we have to check if this user is authorized to perform this transaction
        //        if (!Core.Handler_User.isAuthorized(u.UserID, h.AhwalID, Handler_User.User_Role_Maintenance))
        //        {
        //            OperationLog ol_failed = new OperationLog();
        //            ol_failed.UserID = u.UserID;
        //            ol_failed.OperationID = Handler_Operations.Opeartion_UpdateHandHeld;
        //            ol_failed.StatusID = Handler_Operations.Opeartion_Status_UnAuthorized;
        //            ol_failed.Text = "المستخدم لايملك صلاحية هذه العمليه";
        //            Handler_Operations.Add_New_Operation_Log(ol_failed);
        //            return ol_failed;
        //        }
        //        //next we need to search if there is a handheld car with same serial
        //        DataClassesDataContext db = new DataClassesDataContext(Handler_Global.connectString);
        //        HandHeld HandHeld_exists = db.HandHelds.FirstOrDefault(e => e.HandHeldID.Equals(h.HandHeldID));
        //        if (HandHeld_exists == null)
        //        {
        //            OperationLog ol_failed = new OperationLog();
        //            ol_failed.UserID = u.UserID;
        //            ol_failed.OperationID = Handler_Operations.Opeartion_UpdateHandHeld;
        //            ol_failed.StatusID = Handler_Operations.Opeartion_Status_Failed;
        //            ol_failed.Text = "لم يتم العثور على لاسلكي بالرقم: " + h.Serial;
        //            Handler_Operations.Add_New_Operation_Log(ol_failed);
        //            return ol_failed;
        //        }
        //        //we have to make sure as well thats the new serial is not there before
        //        if (HandHeld_exists.Serial != h.Serial)//in case only the user did choose new serial
        //        {
        //        HandHeld same_HandHeld_serial = db.HandHelds.FirstOrDefault(e => e.Serial.Equals(h.Serial));
        //        if (same_HandHeld_serial != null)
        //        {
        //            OperationLog ol_failed = new OperationLog();
        //            ol_failed.UserID = u.UserID;
        //            ol_failed.OperationID = Handler_Operations.Opeartion_UpdateHandHeld;
        //            ol_failed.StatusID = Handler_Operations.Opeartion_Status_Failed;
        //            ol_failed.Text = "يوجد لاسلكي بنفس رقم : " + h.Serial;
        //            Handler_Operations.Add_New_Operation_Log(ol_failed);
        //            return ol_failed;
        //        }
        //        }

        //        HandHeld_exists.Serial = h.Serial;
        //        HandHeld_exists.BarCode = "HAN"+h.Serial; //just to make sure no one miss this up even me
        //        HandHeld_exists.Defective = h.Defective;
        //        HandHeld_exists.AhwalID = h.AhwalID; //we are allowing changing of AhwalID for Patrol Cars
        //        db.SubmitChanges();
        //    }
        //    catch (Exception ex)
        //    {
        //        OperationLog ol_failed = new OperationLog();
        //        ol_failed.UserID = u.UserID;
        //        ol_failed.OperationID = Handler_Operations.Opeartion_UpdateHandHeld;
        //        ol_failed.StatusID = Handler_Operations.Opeartion_Status_UnKnownError;
        //        ol_failed.Text = ex.Message;
        //        Handler_Operations.Add_New_Operation_Log(ol_failed);
        //        return ol_failed;
        //    }
        //    OperationLog ol = new OperationLog();
        //    ol.UserID = u.UserID; 
        //    ol.OperationID = Handler_Operations.Opeartion_UpdateHandHeld;
        //    ol.StatusID = Handler_Operations.Opeartion_Status_Success;
        //    ol.Text = "تم تعديل بيانات اللاسلكي: " + h.HandHeldID;
        //    Handler_Operations.Add_New_Operation_Log(ol);
        //    return ol;
        //}
        //public static List<HandHeld> GetHandHeldsForUserForRole(User u, long roleID)
        //{
        //    var ahwals = Core.Handler_User.GetUsersAuthorizedAhwalForRole(u, roleID);
        //    List<long> ahwalIDs = new List<long>();
        //    foreach (var r in ahwals)
        //    {
        //        if (!ahwalIDs.Contains(r.AhwalID))
        //            ahwalIDs.Add(r.AhwalID);
        //    }
        //    DataClassesDataContext db = new DataClassesDataContext(Handler_Global.connectString);
        //    var results = db.HandHelds.Where<HandHeld>(e => ahwalIDs.Contains(e.AhwalID) && e.Serial != "NONE");
        //    if (results != null)
        //    {
        //        return results.ToList<HandHeld>();
        //    }
        //    return null;
        //}
        public  Handhelds GetHandHeldBySerialForUserForRole(Users u, string serial, long roleID)
        {
            var ahwals = _user.GetUsersAuthorizedAhwalForRole(u, roleID);
            List<long> ahwalIDs = new List<long>();
            foreach (var r in ahwals)
            {
                if (!ahwalIDs.Contains(r.Ahwalid))
                    ahwalIDs.Add(r.Ahwalid);
            }

            var result = _context.Handhelds.FirstOrDefault<Handhelds>(e => ahwalIDs.Contains(e.Ahwalid) && e.Serial == serial);
            if (result != null)
            {
                return result;
            }
            return null;
        }
        public  Handhelds GetHandHeldByID(Users u, Handhelds h)
        {

            
            //first we have to check if this user is authorized to perform this transaction
            if (!_user.isAuthorized(u.Userid, h.Ahwalid, Handler_User.User_Role_Ahwal))
            {

                return null; //we dont need to log this since its just read operation
            }
            var result = _context.Handhelds.FirstOrDefault<Handhelds>(e => e.Handheldid == h.Handheldid);
            if (result != null)
            {
                return result;
            }
            return null;
        }
        public  List<Handhelds> GetAllHandHelds(Users u)//TODO: Apply permisson checking
        {
         

            return _context.Handhelds.ToList<Handhelds>();

        }
    }
}
