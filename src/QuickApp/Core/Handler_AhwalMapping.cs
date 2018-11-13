using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MOI.Patrol;

namespace Core
{
    public class Handler_AhwalMapping
    {
        private patrolsContext _context = new patrolsContext();
        private Handler_User _user = new Handler_User();
        private Handler_Operations _oper = new Handler_Operations();

        public const int PatrolPersonState_None = 10;

        public const int PatrolPersonState_SunRise = 20;
        public const int PatrolPersonState_Sea = 30;
        public const int PatrolPersonState_Back = 40;
        public const int PatrolPersonState_BackFromWalking = 74;

        public const int PatrolPersonState_SunSet = 50;
        public const int PatrolPersonState_Away = 60;
        public const int PatrolPersonState_Land = 70;
        public const int PatrolPersonState_WalkingPatrol = 72;

        public const int PatrolPersonState_Absent = 80;
        public const int PatrolPersonState_Off = 90;
        public const int PatrolPersonState_Sick = 100;



        public const int CheckInState = 10;
        public const int CheckOutState = 20;


        //patrol roles
        public const int PatrolRole_None = 0;
        public const int PatrolRole_CaptainAllSectors = 10;
        public const int PatrolRole_CaptainShift = 20;
        public const int PatrolRole_CaptainSector = 30;
        public const int PatrolRole_SubCaptainSector = 40;
        public const int PatrolRole_CityGroupOfficer = 50;
        public const int PatrolRole_PatrolPerson = 60;
        public const int PatrolRole_Associate = 70;
        public const int PatrolRole_Temp = 80;
        //public const int PatrolRole_TodaysOff = 70;
        //public const int PatrolRole_Absent = 80;
        //public const int PatrolRole_SickLeave = 90;
        //shifts
        public const int Shifts_Morning = 1;
        public const int Shifts_Afternoon = 2;
        public const int Shifts_Night = 3;

        //sectors 
        public const int Sector_Public = 1;
        public const int Sector_First = 2;
        public const int Sector_Second = 3;
        public const int Sector_Third = 4;
        public const int Sector_Fourth = 5;
        public const int Sector_Fifth = 6;
        public const int Sector_North = 7;
        public const int Sector_South = 8;
        public const int Sector_West = 9;

        public Ahwalmapping GetMappingByID(Users u, long mappingID, long roleID)
        {
            var ahwals = _user.GetUsersAuthorizedAhwalForRole(u, roleID);
            List<long> Ahwalids = new List<long>();
            foreach (var r in ahwals)
            {
                if (!Ahwalids.Contains(r.Ahwalid))
                    Ahwalids.Add(r.Ahwalid);
            }

            var result = _context.Ahwalmapping.FirstOrDefault<Ahwalmapping>(e => Ahwalids.Contains(e.Ahwalid) && e.Ahwalmappingid == mappingID);
            if (result != null)
            {
                return result;
            }
            return null;
        }

        public  Ahwalmapping GetMappingByPersonID(Users u, Persons p)
        {

            //first we have to check if this user is authorized to perform this transaction
            if (!_user.isAuthorized(u.Userid, p.Ahwalid, Handler_User.User_Role_Ahwal))
            {

                return null; //we dont need to log this since its just read operation
            }
            var result = _context.Ahwalmapping.FirstOrDefault<Ahwalmapping>(e => e.Personid == p.Personid);
            if (result != null)
            {
                return result;
            }
            return null;
        }

        public  Operationlogs CheckOutPatrolAndHandHeld(Users u, Ahwalmapping m, Patrolcars p, Handhelds h)
        {
            try
            {
                //first we have to check if this user is authorized to perform this transaction
                if (!_user.isAuthorized(u.Userid, p.Ahwalid, Handler_User.User_Role_Ahwal))
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_UnAuthorized;
                    ol_failed.Text = "المستخدم لايملك صلاحية هذه العمليه";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                //we have to check first that this person doesn't exists before in mapping
                var person_mapping_exists = _context.Ahwalmapping.FirstOrDefault<Ahwalmapping>(e => e.Ahwalmappingid.Equals(m.Ahwalmappingid));
                if (person_mapping_exists == null)
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "لم يتم العثور على التوزيع";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                var GetPerson = _context.Persons.FirstOrDefault<Persons>(e => e.Personid.Equals(m.Personid));
                if (GetPerson == null)
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "لم يتم العثور على الفرد: " + m.Personid; //todo, change it actual person name
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                if (!Convert.ToBoolean(person_mapping_exists.Hasdevices))
                {

                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "هذا الفرد لايملك حاليا اجهزة";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }

                //NEW Added 16/7/2017 - we have to make sure that we cannot sunset someone who currently has an incident
                if (person_mapping_exists.Incidentid != null && !person_mapping_exists.Incidentid.Equals(DBNull.Value))
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "الدورية مستلمه لازالت مستلمه بلاغ-خاطب العمليات";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }


                person_mapping_exists.Hasdevices = Convert.ToByte(0);
                person_mapping_exists.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_SunSet;
                person_mapping_exists.Sunsettimestamp = DateTime.Now;
                person_mapping_exists.Laststatechangetimestamp = DateTime.Now;



                _context.SaveChanges();
                //log it

                //we have to add this record in checkIn and CheckOut Table
                var PatrolCheckOutLog = new Patrolcheckinout();
                PatrolCheckOutLog.Checkinoutstateid = Core.Handler_AhwalMapping.CheckOutState;
                PatrolCheckOutLog.Timestamp = DateTime.Now;
                PatrolCheckOutLog.Personid = m.Personid;
                PatrolCheckOutLog.Patrolid = p.Patrolid;
                // _context.Patrolcheckinout.Add(PatrolCheckOutLog);
                _context.Patrolcheckinout.Add(PatrolCheckOutLog);

                 var HandHeldCheckOutLog = new Handheldscheckinout();
                HandHeldCheckOutLog.Checkinoutstateid = Core.Handler_AhwalMapping.CheckOutState;
                HandHeldCheckOutLog.Timestamp = DateTime.Now;
                HandHeldCheckOutLog.Personid = m.Personid;
                HandHeldCheckOutLog.Handheldid = h.Handheldid;
                _context.Handheldscheckinout.Add(HandHeldCheckOutLog);

                _context.SaveChanges();

                //record this in personstatechangelog
                var personStateLog = new Patrolpersonstatelog();
                personStateLog.Userid = u.Userid;
                personStateLog.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_SunSet;
                personStateLog.Timestamp = DateTime.Now;
                personStateLog.Personid = m.Personid;
                LogPersonStateChange(personStateLog);

                Operationlogs ol = new Operationlogs();
                ol.Userid = u.Userid;
                ol.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                ol.Statusid = Handler_Operations.Opeartion_Status_Success;
                ol.Text = "تم الاستلام من الفرد: " + GetPerson.Milnumber.ToString() + " " + GetPerson.Name +
                    "  الدورية رقم: " + p.Platenumber + " والجهاز رقم: " + h.Serial;
                _oper.Add_New_Operation_Log(ol);

                return ol;
            }
            catch (Exception ex)
            {
                Operationlogs ol_failed = new Operationlogs();
                ol_failed.Userid = u.Userid;
                ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                ol_failed.Statusid = Handler_Operations.Opeartion_Status_UnKnownError;
                ol_failed.Text = ex.Message;
                _oper.Add_New_Operation_Log(ol_failed);
                return ol_failed;
            }
        }

        public  void LogPersonStateChange(Patrolpersonstatelog p)
        {
            
            _context.Patrolpersonstatelog.Add(p);
            _context.SaveChanges();
        }

        public  bool PatrolCarWithSomeOneElse(Users u, long WantToHavePersonID, long WantedPatrolID)
        {
            var result = _context.Ahwalmapping.FirstOrDefault<Ahwalmapping>(e => e.Hasdevices == 1 && e.Personid != WantToHavePersonID && e.Patrolroleid == WantedPatrolID);
            if (result == null)
            {
                return false;
            }
            return true;
        }
        public  bool HandHeldWithSomeOneElse(Users u, long WantToHavePersonID, long WantedHandHeldID)
        {
            //check if there is a user, who still have it, and its not the same user asking for it
            var result = _context.Ahwalmapping.FirstOrDefault<Ahwalmapping>(e => e.Hasdevices == 1 && e.Personid != WantToHavePersonID && e.Handheldid == WantedHandHeldID);
            if (result == null)
            {
                return false;
            }
            return true;
        }

        public  Operationlogs CheckInPatrolAndHandHeld(Users u, Ahwalmapping m, Patrolcars p, Handhelds h)
        {
            try
            {
                //first we have to check if this user is authorized to perform this transaction
                if (!_user.isAuthorized(u.Userid, p.Ahwalid, Handler_User.User_Role_Ahwal))
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckInPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_UnAuthorized;
                    ol_failed.Text = "المستخدم لايملك صلاحية هذه العمليه";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                //we have to check first that this person doesn't exists before in mapping

                var person_mapping_exists = _context.Ahwalmapping.FirstOrDefault<Ahwalmapping>(e => e.Ahwalmappingid.Equals(m.Ahwalmappingid));
                if (person_mapping_exists == null)
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckInPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "لم يتم العثور على التوزيع";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                var GetPerson = _context.Persons.FirstOrDefault<Persons>(e => e.Personid.Equals(m.Personid));
                if (GetPerson == null)
                {
                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckInPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "لم يتم العثور على الفرد: " + m.Personid; //todo, change it actual person name
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                if (Convert.ToBoolean(person_mapping_exists.Hasdevices))
                {

                    Operationlogs ol_failed = new Operationlogs();
                    ol_failed.Userid = u.Userid;
                    ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckInPatrolAndHandHeld;
                    ol_failed.Statusid = Handler_Operations.Opeartion_Status_Failed;
                    ol_failed.Text = "هذا المستخدم يملك حاليا اجهزة";
                    _oper.Add_New_Operation_Log(ol_failed);
                    return ol_failed;
                }
                person_mapping_exists.Patrolid = p.Patrolid;
                person_mapping_exists.Handheldid = h.Handheldid;
                person_mapping_exists.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_SunRise;
                person_mapping_exists.Sunrisetimestamp = DateTime.Now;
                person_mapping_exists.Sunsettimestamp = null;//we have to reset this time
                person_mapping_exists.Hasdevices = Convert.ToByte(1);
                person_mapping_exists.Laststatechangetimestamp = DateTime.Now;
                _context.SaveChanges();
                //log it

                //we have to add this record in checkIn and CheckOut Table
                var PatrolCheckInLog = new Patrolcheckinout();
                PatrolCheckInLog.Checkinoutstateid = Core.Handler_AhwalMapping.CheckInState;
                PatrolCheckInLog.Timestamp = DateTime.Now;
                PatrolCheckInLog.Personid = m.Personid;
                PatrolCheckInLog.Patrolid = p.Patrolid;
                _context.Patrolcheckinout.Add(PatrolCheckInLog);

                var HandHeldCheckInLog = new Handheldscheckinout();
                HandHeldCheckInLog.Checkinoutstateid = Core.Handler_AhwalMapping.CheckInState;
                HandHeldCheckInLog.Timestamp = DateTime.Now;
                HandHeldCheckInLog.Personid = m.Personid;
                HandHeldCheckInLog.Handheldid = h.Handheldid;
                _context.Handheldscheckinout.Add(HandHeldCheckInLog);

                _context.SaveChanges();

                //record this in personstatechangelog
                var personStateLog = new Patrolpersonstatelog();
                personStateLog.Userid = u.Userid;
                personStateLog.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_SunRise;
                personStateLog.Timestamp = DateTime.Now;
                personStateLog.Personid = m.Personid;
                LogPersonStateChange(personStateLog);

                Operationlogs ol = new Operationlogs();
                ol.Userid = u.Userid;
                ol.Operationid = Handler_Operations.Opeartion_Mapping_CheckInPatrolAndHandHeld;
                ol.Statusid = Handler_Operations.Opeartion_Status_Success;
                ol.Text = "تم تسليم الفرد: " + GetPerson.Milnumber.ToString() + " " + GetPerson.Name +
                    "  الدورية رقم: " + p.Platenumber + " والجهاز رقم: " + h.Serial;
                _oper.Add_New_Operation_Log(ol);

                return ol;
            }
            catch (Exception ex)
            {
                Operationlogs ol_failed = new Operationlogs();
                ol_failed.Userid = u.Userid;
                ol_failed.Operationid = Handler_Operations.Opeartion_Mapping_CheckOutPatrolAndHandHeld;
                ol_failed.Statusid = Handler_Operations.Opeartion_Status_UnKnownError;
                ol_failed.Text = ex.Message;
                _oper.Add_New_Operation_Log(ol_failed);
                return ol_failed;
            }
        }

       
    }
}
