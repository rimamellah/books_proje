
import { useState } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Stack
} from "@mui/material";
import supabase from "../../supabaseClient";   // غيّر المسار إذا لزم

export default function BorrowDialog({ open, onClose, book, onSaved }) {
  const [step, setStep]   = useState(0);   // 0 = إدخال بيانات + تأكيد، 1 = تأكيد نهائي
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  /* إعادة ضبط وإغلاق */
  const resetAndClose = () => {
    setStep(0);
    setName("");
    setPhone("");
    setSaving(false);
    onClose();
  };

  /* تحديث الصفّ في Supabase */
  const handleSave = async () => {
    if (!book) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("books")
      .update({
        borrowed: true,
        borrower_name:  name.trim(),
        borrower_phone: phone.trim()
      })
      .eq("id", book.id)
      .select("*")
      .single();

    setSaving(false);

    if (error) {
      console.error("خطأ في التحديث:", error.message);
      alert("تعذّر حفظ البيانات!");
      return;
    }

    /* مرّر الصفّ الجديد للأبّ */
    onSaved?.(data);
    resetAndClose();
  };

  /* صلاحية المتابعة */
  const canProceed = name.trim() && phone.trim();

  return (
    <Dialog open={open} onClose={resetAndClose} dir="rtl"   fullWidth        // يخلي العرض يمتلئ العرض المتاح
  maxWidth="sm"    >
      {step === 0 ? (
        <>
          <DialogTitle>تأكيد الاستعارة</DialogTitle>
          <DialogContent>
            <DialogContentText>
              هل أنت متأكد أنك تريد استعارة الكتاب:&nbsp;
              <strong>{book?.title}</strong>؟
            </DialogContentText>

            {/* حقول المستعير */}
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 13 }}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetAndClose} color="error">إلغاء</Button>
            <Button
              onClick={() => setStep(1)}
              color="primary"
              disabled={!canProceed}
            >
              التالي
            </Button>
          </DialogActions>
        </>
      ) : (
        /* --------- خطوة التأكيد النهائي --------- */
        <>
          <DialogTitle>تأكيد نهائي</DialogTitle>
          <DialogContent>
            <DialogContentText>
              سيتم تسجيل الاستعارة باسم:
              <br />
              <strong>{name}</strong> 
               </DialogContentText>
               <DialogContentText>
               <br />
               ورقم الجوال :  
                 <br /><strong>{phone}</strong>
               </DialogContentText>

          </DialogContent>
          <DialogActions>
            <Button onClick={resetAndClose} color="error">إلغاء</Button>
            <Button
              onClick={handleSave}
              color="primary"
              disabled={saving}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
